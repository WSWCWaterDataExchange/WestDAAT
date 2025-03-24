using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationDocumentDownloadSasTokenRequestHandler : IRequestHandler<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>
{
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IBlobStorageSdk _blobStorageSdk;

    public ApplicationDocumentDownloadSasTokenRequestHandler(IApplicationAccessor applicationAccessor, IBlobStorageSdk blobStorageSdk)
    {
        _applicationAccessor = applicationAccessor;
        _blobStorageSdk = blobStorageSdk;
    }
    
    public async Task<ApplicationDocumentDownloadSasTokenResponse> Handle(ApplicationDocumentDownloadSasTokenRequest request)
    {
        var accessorRequest = request.Map<ApplicationDocumentLoadSingleRequest>();
        var accessorResponse = (ApplicationDocumentLoadSingleResponse)await _applicationAccessor.Load(accessorRequest);

        var blobName = accessorResponse.SupportingDocument.BlobName;
        var sasUris = await _blobStorageSdk.GetSasUris(Containers.ApplicationDocuments, [blobName], TimeSpan.FromMinutes(10),
            Azure.Storage.Sas.BlobContainerSasPermissions.Read);
        
         return new ApplicationDocumentDownloadSasTokenResponse
        {
            SasToken = sasUris[blobName].ToString(),
            FileName = accessorResponse.SupportingDocument.FileName,
        };
    }
}