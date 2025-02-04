using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationCreateRequestHandler :
    IRequestHandler<WaterConservationApplicationCreateRequest, WaterConservationApplicationCreateResponse>
{
    private readonly IApplicationFormattingEngine _applicationFormattingEngine;

    public WaterConservationApplicationCreateRequestHandler(IApplicationFormattingEngine applicationFormattingEngine)
    {
        _applicationFormattingEngine = applicationFormattingEngine;
    }

    public Task<WaterConservationApplicationCreateResponse> Handle(WaterConservationApplicationCreateRequest request)
    {
        // verify in-progress wca does not already exist

        // hydrate request (display id)

        // save to db

        throw new NotImplementedException();
    }
}
