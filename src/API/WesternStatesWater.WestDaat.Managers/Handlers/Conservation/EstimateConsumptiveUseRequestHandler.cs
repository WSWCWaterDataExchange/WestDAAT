using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class EstimateConsumptiveUseRequestHandler : IRequestHandler<EstimateConsumptiveUseRequest, EstimateConsumptiveUseResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }
    public IApplicationAccessor ApplicationAccessor { get; }

    public EstimateConsumptiveUseRequestHandler(ICalculationEngine calculationEngine,
        IOpenEtSdk openEtSdk,
        IApplicationAccessor applicationAccessor)
    {
        CalculationEngine = calculationEngine;
        OpenEtSdk = openEtSdk;
        ApplicationAccessor = applicationAccessor;
    }

    public async Task<EstimateConsumptiveUseResponse> Handle(EstimateConsumptiveUseRequest request)
    {
        var multiPolygonEtRequest = request.Map<MultiPolygonYearlyEtRequest>();
        var multiPolygonYearlyEtResponse = (MultiPolygonYearlyEtResponse)await CalculationEngine.Calculate(multiPolygonEtRequest);

        EstimateConservationPaymentResponse estimateConservationPaymentResponse = null;
        if (request.CompensationRateDollars.HasValue)
        {
            var estimateConservationPaymentRequest = DtoMapper.Map<EstimateConservationPaymentRequest>((request, multiPolygonYearlyEtResponse));
            estimateConservationPaymentResponse = (EstimateConservationPaymentResponse)await CalculationEngine.Calculate(estimateConservationPaymentRequest);

            // only store the estimate if a compensation estimate was requested
            var storeEstimateRequest = DtoMapper.Map<ApplicationEstimateStoreRequest>((
                request,
                multiPolygonYearlyEtResponse,
                estimateConservationPaymentResponse
            ));

            await ApplicationAccessor.Store(storeEstimateRequest);
        }

        return new EstimateConsumptiveUseResponse
        {
            ConservationPayment = estimateConservationPaymentResponse?.EstimatedCompensationDollars,
            TotalAverageYearlyEtAcreFeet = multiPolygonYearlyEtResponse.DataCollections.Sum(dc => dc.AverageYearlyEtInAcreFeet),
            DataCollections = multiPolygonYearlyEtResponse.DataCollections.Map<Contracts.Client.PolygonEtDataCollection[]>(),
        };
    }
}
