using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
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
        // determine application's linked funding org
        var applicationDetailsRequest = request.Map<ApplicationLoadSingleRequest>();
        var applicationDetailsResponse = (ApplicationLoadSingleResponse)await ApplicationAccessor.Load(applicationDetailsRequest);

        // we need funding org details to determine the parameters for computing each location's ET
        var fundingOrgDetailsRequest = applicationDetailsResponse.Map<OrganizationFundingDetailsRequest>();
        var fundingOrgDetailsResponse = (OrganizationFundingDetailsResponse)await OrganizationAccessor.Load(fundingOrgDetailsRequest);

        // compute ET
        var evapotranspirationRequest = DtoMapper.Map<MultiPolygonYearlyEtRequest>((request, fundingOrgDetailsResponse.Organization));
        var evapotranspirationResponse = (MultiPolygonYearlyEtResponse)await CalculationEngine.Calculate(evapotranspirationRequest);

        var dataCollections = evapotranspirationResponse.Map<Contracts.Client.PolygonEtDataCollection[]>();

        EstimateConservationPaymentResponse estimateConservationPaymentResponse = null;
        if (request.OverwriteEstimate)
        {
            var originalEstimate = applicationDetailsResponse.Application.Estimate;
            var estimateConservationPaymentRequest = DtoMapper.Map<EstimateConservationPaymentRequest>((originalEstimate, evapotranspirationResponse));
            estimateConservationPaymentResponse = (EstimateConservationPaymentResponse)await CalculationEngine.Calculate(estimateConservationPaymentRequest);

            // store estimate
            var storeEstimateRequest = DtoMapper.Map<ApplicationEstimateStoreRequest>((
                request,
                fundingOrgDetailsResponse.Organization,
                originalEstimate,
                evapotranspirationResponse,
                estimateConservationPaymentResponse
            ));

            var storeEstimateResponse = (ApplicationEstimateStoreResponse)await ApplicationAccessor.Store(storeEstimateRequest);

            // connect the EstimateLocation Ids to the ET data
            foreach (var collection in dataCollections)
            {
                var matchingEstimateLocation = storeEstimateResponse.Details.Single(detail => detail.PolygonWkt == collection.PolygonWkt);
                collection.WaterConservationApplicationEstimateLocationId = matchingEstimateLocation.WaterConservationApplicationEstimateLocationId;
            }
        }

        return new ReviewerEstimateConsumptiveUseResponse
        {
            ConservationPayment = null,
            CumulativeTotalEtInAcreFeet = evapotranspirationResponse.DataCollections.Sum(dc => dc.AverageYearlyTotalEtInAcreFeet),
            CumulativeNetEtInAcreFeet = evapotranspirationResponse.DataCollections.Sum(dc => dc.AverageYearlyNetEtInAcreFeet.Value),
            DataCollections = dataCollections,
        };
    }
}
