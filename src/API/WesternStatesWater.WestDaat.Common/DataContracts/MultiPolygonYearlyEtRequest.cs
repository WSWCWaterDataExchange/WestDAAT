namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MultiPolygonYearlyEtRequest : CalculateRequestBase
{
    /// <summary>
    /// Array of polygons in WKT format.
    /// </summary>
    public string[] Polygons { get; set; }

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
