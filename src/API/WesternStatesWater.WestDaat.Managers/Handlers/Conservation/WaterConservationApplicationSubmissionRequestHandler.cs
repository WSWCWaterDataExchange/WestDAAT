using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionRequestHandler : IRequestHandler<WaterConservationApplicationSubmissionRequest, ApplicationStoreResponseBase>
{
    public Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationSubmissionRequest request)
    {
        throw new NotImplementedException();
    }
}
