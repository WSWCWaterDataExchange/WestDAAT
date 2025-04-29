namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MultiPolygonYearlyEtRequest : CalculateRequestBase
{
    public MapPolygon[] Polygons { get; set; }

    public MapPoint ControlLocation { get; set; }

    public RasterTimeSeriesModel Model { get; set; }

    /// <summary>
    /// Inclusive date range start.
    /// </summary>
    public DateOnly DateRangeStart { get; set; }


    /// <summary>
    /// Inclusive date range end.
    /// </summary>
    public DateOnly DateRangeEnd { get; set; }
}
