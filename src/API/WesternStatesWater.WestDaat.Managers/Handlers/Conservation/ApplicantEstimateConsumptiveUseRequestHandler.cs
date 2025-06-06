﻿using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ApplicantEstimateConsumptiveUseRequestHandler : IRequestHandler<ApplicantEstimateConsumptiveUseRequest, ApplicantEstimateConsumptiveUseResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }
    public IApplicationAccessor ApplicationAccessor { get; }
    public IOrganizationAccessor OrganizationAccessor { get; }
    public IWaterAllocationAccessor WaterAllocationAccessor { get; }

    public ApplicantEstimateConsumptiveUseRequestHandler(ICalculationEngine calculationEngine,
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

    public async Task<ApplicantEstimateConsumptiveUseResponse> Handle(ApplicantEstimateConsumptiveUseRequest request)
    {
        var waterRightFundingOrgDetails = await WaterAllocationAccessor.GetWaterRightFundingOrgDetailsByUuid(request.WaterRightNativeId);

        var fundingOrgDetailsRequest = waterRightFundingOrgDetails.Map<OrganizationFundingDetailsRequest>();
        var fundingOrgDetailsResponse = (OrganizationFundingDetailsResponse)await OrganizationAccessor.Load(fundingOrgDetailsRequest);

        var multiPolygonEtRequest = DtoMapper.Map<MultiPolygonYearlyEtRequest>((request, fundingOrgDetailsResponse.Organization));
        var multiPolygonYearlyEtResponse = (MultiPolygonYearlyEtResponse)await CalculationEngine.Calculate(multiPolygonEtRequest);

        var dataCollections = multiPolygonYearlyEtResponse.DataCollections.Map<Contracts.Client.PolygonEtDataCollection[]>();

        EstimateConservationPaymentResponse estimateConservationPaymentResponse = null;
        if (request.CompensationRateDollars.HasValue)
        {
            var estimateConservationPaymentRequest = DtoMapper.Map<EstimateConservationPaymentRequest>((request, multiPolygonYearlyEtResponse));
            estimateConservationPaymentResponse = (EstimateConservationPaymentResponse)await CalculationEngine.Calculate(estimateConservationPaymentRequest);

            // only store the estimate if a compensation estimate was requested
            var storeEstimateRequest = DtoMapper.Map<ApplicationEstimateStoreRequest>((
                request,
                fundingOrgDetailsResponse.Organization,
                multiPolygonYearlyEtResponse,
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

        return new ApplicantEstimateConsumptiveUseResponse
        {
            ConservationPayment = estimateConservationPaymentResponse?.EstimatedCompensationDollars,
            CumulativeTotalEtInAcreFeet = multiPolygonYearlyEtResponse.DataCollections.Sum(dc => dc.AverageYearlyTotalEtInAcreFeet),
            DataCollections = dataCollections,
        };
    }
}
