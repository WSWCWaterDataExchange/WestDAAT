using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class EstimateEvapotranspirationRequestHandler : IRequestHandler<EstimateEvapotranspirationRequest, EstimateEvapotranspirationResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }

    public EstimateEvapotranspirationRequestHandler(ICalculationEngine calculationEngine,
        IOpenEtSdk openEtSdk)
    {
        CalculationEngine = calculationEngine;
        OpenEtSdk = openEtSdk;
    }

    public async Task<EstimateEvapotranspirationResponse> Handle(EstimateEvapotranspirationRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}
