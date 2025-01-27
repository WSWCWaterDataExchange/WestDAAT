using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class CalculateEvapotranspirationRequestHandler : IRequestHandler<CalculateEvapotranspirationRequest, CalculateEvapotranspirationResponse>
{
    public IOpenEtSdk OpenEtSdk { get; }

    public CalculateEvapotranspirationRequestHandler(IOpenEtSdk openEtSdk)
    {
        OpenEtSdk = openEtSdk;
    }

    public async Task<CalculateEvapotranspirationResponse> Handle(CalculateEvapotranspirationRequest request)
    {
        var rasterTimeSeriesPolygonRequests = request.Polygons.Select(polygon =>
            DtoMapper.Map<CommonContracts.RasterTimeSeriesPolygonRequest>((request, polygon))
        );
        var rasterTimeSeriesPolygonResponses = await Task.WhenAll(rasterTimeSeriesPolygonRequests.Select(OpenEtSdk.RasterTimeseriesPolygon));


    }
}
