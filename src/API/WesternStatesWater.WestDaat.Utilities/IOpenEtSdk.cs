using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IOpenEtSdk
{
    Task<RasterTimeSeriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeSeriesPolygonRequest request);
}