using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationDocumentUploadSasTokenRequestHandler : IRequestHandler<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>
{
    private readonly IBlobStorageSdk _blobStorageSdk;

    public ApplicationDocumentUploadSasTokenRequestHandler(IBlobStorageSdk blobStorageSdk)
    {
        _blobStorageSdk = blobStorageSdk;
    }

    public async Task<ApplicationDocumentUploadSasTokenResponse> Handle(ApplicationDocumentUploadSasTokenRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Made it to ApplicationDocumentUploadSasTokenRequest handler");
    }
}