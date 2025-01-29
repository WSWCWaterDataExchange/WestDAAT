using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class EstimateConsumptiveUseRequestHandler : IRequestHandler<EstimateConsumptiveUseRequest, EstimateConsumptiveUseResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }

    public EstimateConsumptiveUseRequestHandler(ICalculationEngine calculationEngine,
        IOpenEtSdk openEtSdk)
    {
        CalculationEngine = calculationEngine;
        OpenEtSdk = openEtSdk;
    }

    public async Task<EstimateConsumptiveUseResponse> Handle(EstimateConsumptiveUseRequest request)
    {

        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}
