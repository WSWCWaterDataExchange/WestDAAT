using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

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
        var rasterTimeSeriesPolygonRequests = request.Polygons.Select(polygon =>
            DtoMapper.Map<CommonContracts.RasterTimeSeriesPolygonRequest>((request, polygon))
        ).ToArray();
        var rasterTimeSeriesPolygonResponses = await Task.WhenAll(rasterTimeSeriesPolygonRequests.Select(OpenEtSdk.RasterTimeseriesPolygon));

        var calculateTotalAverageEtRequest = DtoMapper.Map<CommonContracts.CalculateTotalAverageEvapotranspirationRequest>((request, rasterTimeSeriesPolygonResponses));
        var calulateTotalAverageEtResponse = CalculationEngine.CalculateTotalAverageEvapotranspiration(calculateTotalAverageEtRequest);

        // temp
        return new EstimateEvapotranspirationResponse
        {
            AverageTotalEtInInches = calulateTotalAverageEtResponse.TotalAverageEvapotranspiration,
        };
    }
}
