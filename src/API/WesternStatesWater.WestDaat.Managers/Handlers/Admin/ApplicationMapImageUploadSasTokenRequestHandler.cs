using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationMapImageUploadSasTokenRequestHandler : IRequestHandler<ApplicationMapImageUploadSasTokenRequest, ApplicationMapImageUploadSasTokenResponse>
{
    private readonly IBlobStorageSdk _blobStorageSdk;

    public ApplicationMapImageUploadSasTokenRequestHandler(IBlobStorageSdk blobStorageSdk)
    {
        _blobStorageSdk = blobStorageSdk;
    }

    public async Task<ApplicationMapImageUploadSasTokenResponse> Handle(ApplicationMapImageUploadSasTokenRequest request)
    {
        var blobName = request.ApplicationId.ToString();

        var sasUri = await _blobStorageSdk.GetSasUris(Containers.ApplicationMapImages, [blobName],
            TimeSpan.FromMinutes(10), Azure.Storage.Sas.BlobContainerSasPermissions.Create);

        var hostname = _blobStorageSdk.BlobServiceHostname();

        return new ApplicationMapImageUploadSasTokenResponse
        {
            SasToken = new SasTokenDetails
            {
                Blobname = blobName,
                SasToken = sasUri.ToString(),
                Hostname = hostname
            }
        };
    }
}