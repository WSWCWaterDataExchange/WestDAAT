using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IOpenEtSdk
{
    Task<RasterTimeSeriesPointResponse> RasterTimeseriesPoint(RasterTimeSeriesPointRequest request);

    Task<RasterTimeSeriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeSeriesPolygonRequest request);
}