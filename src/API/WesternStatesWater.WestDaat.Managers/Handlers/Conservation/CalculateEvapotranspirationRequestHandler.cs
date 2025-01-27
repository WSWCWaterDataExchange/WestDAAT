using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class CalculateEvapotranspirationRequestHandler : IRequestHandler<CalculateEvapotranspirationRequest, CalculateEvapotranspirationResponse>
{
    public ICalculationEngine CalculationEngine { get; }
    public IOpenEtSdk OpenEtSdk { get; }

    public CalculateEvapotranspirationRequestHandler(ICalculationEngine calculationEngine,
        IOpenEtSdk openEtSdk)
    {
        CalculationEngine = calculationEngine;
        OpenEtSdk = openEtSdk;
    }

    public async Task<CalculateEvapotranspirationResponse> Handle(CalculateEvapotranspirationRequest request)
    {
        var rasterTimeSeriesPolygonRequests = request.Polygons.Select(polygon =>
            DtoMapper.Map<CommonContracts.RasterTimeSeriesPolygonRequest>((request, polygon))
        );
        var rasterTimeSeriesPolygonResponses = await Task.WhenAll(rasterTimeSeriesPolygonRequests.Select(OpenEtSdk.RasterTimeseriesPolygon));

        var calculateTotalAverageEtRequest = DtoMapper.Map<CommonContracts.CalculateTotalAverageEvapotranspirationRequest>((request, rasterTimeSeriesPolygonResponses));
        var calulateTotalAverageEtResponse = CalculationEngine.CalculateTotalAverageEvapotranspiration(calculateTotalAverageEtRequest);

        // temp
        return new CalculateEvapotranspirationResponse();
    }
}
