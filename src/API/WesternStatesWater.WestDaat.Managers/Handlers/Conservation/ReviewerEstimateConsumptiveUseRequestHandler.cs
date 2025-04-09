using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ReviewerEstimateConsumptiveUseRequestHandler : IRequestHandler<ReviewerEstimateConsumptiveUseRequest, ReviewerEstimateConsumptiveUseResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IApplicationAccessor ApplicationAccessor { get; }
    public IOrganizationAccessor OrganizationAccessor { get; }

    public ReviewerEstimateConsumptiveUseRequestHandler(ICalculationEngine calculationEngine,
        IApplicationAccessor applicationAccessor,
        IOrganizationAccessor organizationAccessor)
    {
        CalculationEngine = calculationEngine;
        ApplicationAccessor = applicationAccessor;
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<ReviewerEstimateConsumptiveUseResponse> Handle(ReviewerEstimateConsumptiveUseRequest request)
    {
        // determine application's linked funding org
        var applicationDetailsRequest = request.Map<ApplicationLoadSingleRequest>();
        var applicationDetailsResponse = (ApplicationLoadSingleResponse)await ApplicationAccessor.Load(applicationDetailsRequest);

        // we need funding org details to determine the parameters for computing each location's ET
        var fundingOrgDetailsRequest = applicationDetailsResponse.Map<OrganizationFundingDetailsRequest>();
        var fundingOrgDetailsResponse = (OrganizationFundingDetailsResponse)await OrganizationAccessor.Load(fundingOrgDetailsRequest);

        var evapotranspirationRequest = DtoMapper.Map<MultiPolygonYearlyEtRequest>((request, fundingOrgDetailsResponse.Organization));
        var evapotranspirationResponse = (MultiPolygonYearlyEtResponse)await CalculationEngine.Calculate(evapotranspirationRequest);

        // initialize client contracts - they may need to be hydrated
        var responseLocationsEtData = evapotranspirationResponse.DataCollections.Map<Contracts.Client.PolygonEtDataCollection[]>();
        var responseControlLocationEtData = evapotranspirationResponse.ControlLocationDataCollection.Map<Contracts.Client.PointEtDataCollection>();

        var originalEstimate = applicationDetailsResponse.Application.Estimate;
        var estimateConservationPaymentRequest = DtoMapper.Map<EstimateConservationPaymentRequest>((originalEstimate, evapotranspirationResponse));
        var estimateConservationPaymentResponse = (EstimateConservationPaymentResponse)await CalculationEngine.Calculate(estimateConservationPaymentRequest);

        if (request.UpdateEstimate)
        {
            var updateEstimateRequest = DtoMapper.Map<ApplicationEstimateUpdateRequest>((
                request,
                evapotranspirationResponse,
                estimateConservationPaymentResponse
            ));

            var updateEstimateResponse = (ApplicationEstimateUpdateResponse)await ApplicationAccessor.Store(updateEstimateRequest);

            // connect the EstimateLocation Ids to the ET data
            foreach (var collection in responseLocationsEtData)
            {
                var matchingEstimateLocation = updateEstimateResponse.Details.Single(detail => detail.PolygonWkt == collection.PolygonWkt);
                collection.WaterConservationApplicationEstimateLocationId = matchingEstimateLocation.WaterConservationApplicationEstimateLocationId;
            }

            // connect the EstimateControlLocation Ids to the ET data
            var matchingEstimateControlLocationId = updateEstimateResponse.ControlLocationDetails.WaterConservationApplicationEstimateControlLocationId;
            responseControlLocationEtData.WaterConservationApplicationEstimateControlLocationId = matchingEstimateControlLocationId;
        }

        var response = new ReviewerEstimateConsumptiveUseResponse
        {
            ConservationPayment = estimateConservationPaymentResponse.EstimatedCompensationDollars,
            CumulativeTotalEtInAcreFeet = evapotranspirationResponse.DataCollections.Sum(dc => dc.AverageYearlyTotalEtInAcreFeet),
            CumulativeNetEtInAcreFeet = evapotranspirationResponse.DataCollections.Sum(dc => dc.AverageYearlyNetEtInAcreFeet.Value),
            DataCollections = responseLocationsEtData,
            ControlDataCollection = responseControlLocationEtData,
        };

        return response;
    }
}
