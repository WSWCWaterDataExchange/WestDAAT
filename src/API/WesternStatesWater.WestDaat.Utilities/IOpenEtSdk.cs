using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

public interface IOpenEtSdk
{
    Task<RasterTimeseriesPolygonResponse> RasterTimeseriesPolygon(RasterTimeseriesPolygonRequest request);
}