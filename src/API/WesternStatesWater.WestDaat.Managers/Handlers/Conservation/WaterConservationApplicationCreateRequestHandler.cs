using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationCreateRequestHandler :
    IRequestHandler<WaterConservationApplicationCreateRequest, WaterConservationApplicationCreateResponse>
{
    public WaterConservationApplicationCreateRequestHandler(

        )
    {
    }

    public Task<WaterConservationApplicationCreateResponse> Handle(WaterConservationApplicationCreateRequest request)
    {
        // verify in-progress wca does not already exist

        // hydrate request (display id)

        // save to db

        throw new NotImplementedException();
    }
}
