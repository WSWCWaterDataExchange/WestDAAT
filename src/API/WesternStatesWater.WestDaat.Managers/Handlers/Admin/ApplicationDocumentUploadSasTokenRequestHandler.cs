using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationDocumentUploadSasTokenRequestHandler : IRequestHandler<ApplicationDocumentUploadSasTokenRequest, ApplicationDocumentUploadSasTokenResponse>
{
    private readonly IBlobStorageSdk _blobStorageSdk;
    
    private readonly IContextUtility _contextUtility;

    public ApplicationDocumentUploadSasTokenRequestHandler(IBlobStorageSdk blobStorageSdk, IContextUtility contextUtility)
    {
        _blobStorageSdk = blobStorageSdk;
        _contextUtility = contextUtility;
    }

    public async Task<ApplicationDocumentUploadSasTokenResponse> Handle(ApplicationDocumentUploadSasTokenRequest request)
    {
        var userId = _contextUtility.GetRequiredContext<UserContext>().UserId;
        
        var blobNames = Enumerable.Range(0, request.FileUploadCount)
            .Select(_ => $"{userId}/{Guid.NewGuid()}")
            .ToArray();
    
        var sasUris = await _blobStorageSdk.GetSasUris(AzureNames.ApplicationDocuments, blobNames,
            TimeSpan.FromMinutes(10), Azure.Storage.Sas.BlobContainerSasPermissions.Create);
    
        var hostname = _blobStorageSdk.BlobServiceHostname();
    
        var details = blobNames.Select(blobName =>
        {
            return new CLI.SasTokenDetails
            {
                Blobname = blobName,
                SasToken = sasUris[blobName].ToString(),
                Hostname = hostname.ToString()
            };
        }).ToArray();
    
        return new CLI.FileUploadSasTokensResponse
        {
            TokenDetails = details
        };
    }
}