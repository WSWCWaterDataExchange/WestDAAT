using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class CalculateEvapotranspirationRequestHandler : IRequestHandler<CalculateEvapotranspirationRequest, CalculateEvapotranspirationResponse>
{
    public Task<CalculateEvapotranspirationResponse> Handle(CalculateEvapotranspirationRequest request)
    {
        throw new NotImplementedException();
    }
}
