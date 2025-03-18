using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class ApplicationDocumentDownloadSasTokenRequestHandler : IRequestHandler<ApplicationDocumentDownloadSasTokenRequest, ApplicationDocumentDownloadSasTokenResponse>
{
    // private readonly IBlobStorageSdk _blobStorageSdk;
    //
    // private readonly IContextUtility _contextUtility;
    public async Task<ApplicationDocumentDownloadSasTokenResponse> Handle(ApplicationDocumentDownloadSasTokenRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("made it to handler");
    }
}