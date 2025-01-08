using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class EnrichJwtRequestHandler : IRequestHandler<EnrichJwtRequest, EnrichJwtResponse>
{
    public Task<EnrichJwtResponse> Handle(EnrichJwtRequest request)
    {
        throw new NotImplementedException();
    }
}
