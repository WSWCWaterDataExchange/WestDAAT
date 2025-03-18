using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationDocumentDownloadSasTokenRequestHandler : IRequestHandler<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>
{
    public IApplicationAccessor ApplicationAccessor { get; }

    public ApplicationDocumentDownloadSasTokenRequestHandler(IApplicationAccessor applicationAccessor)
    {
        ApplicationAccessor = applicationAccessor;
    }
    
    public async Task<ApplicationDocumentDownloadSasTokenResponse> Handle(ApplicationDocumentDownloadSasTokenRequest request)
    {
        var accessorRequest = request.Map<ApplicationDocumentLoadSingleRequest>();
        var accessorResponse = (ApplicationDocumentLoadSingleResponse)await ApplicationAccessor.Load(accessorRequest);

        return new ApplicationDocumentDownloadSasTokenResponse
        {
            SasToken = "sas-token",
            FileName = accessorResponse.SupportingDocument.FileName,
        };
    }
}