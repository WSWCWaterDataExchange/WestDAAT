using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ReviewerEstimateConsumptiveUseRequestHandler : IRequestHandler<ReviewerEstimateConsumptiveUseRequest, ReviewerEstimateConsumptiveUseResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }
    public IApplicationAccessor ApplicationAccessor { get; }
    public IOrganizationAccessor OrganizationAccessor { get; }
    public IWaterAllocationAccessor WaterAllocationAccessor { get; }

    public ReviewerEstimateConsumptiveUseRequestHandler(ICalculationEngine calculationEngine,
        IOpenEtSdk openEtSdk,
        IApplicationAccessor applicationAccessor,
        IOrganizationAccessor organizationAccessor,
        IWaterAllocationAccessor waterAllocationAccessor)
    {
        CalculationEngine = calculationEngine;
        OpenEtSdk = openEtSdk;
        ApplicationAccessor = applicationAccessor;
        OrganizationAccessor = organizationAccessor;
        WaterAllocationAccessor = waterAllocationAccessor;
    }

    public async Task<ReviewerEstimateConsumptiveUseResponse> Handle(ReviewerEstimateConsumptiveUseRequest request)
    {

    }
}
