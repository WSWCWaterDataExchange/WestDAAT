namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class RasterTimeseriesPolygonRequest
{
    /// <summary>
    /// Inclusive start date.
    /// </summary>
    public DateOnly DateRangeStart { get; set; }

    /// <summary>
    /// Inclusive end date.
    /// </summary>
    public DateOnly DateRangeEnd { get; set; }

    public NetTopologySuite.Geometries.Geometry Geometry { get; set; }

    public RasterTimeseriesInterval Interval { get; set; }

    public RasterTimeseriesModel Model { get; set; }

    public RasterTimeseriesPixelReducer PixelReducer { get; set; }

    public RasterTimeseriesReferenceEt ReferenceEt { get; set; }

    public RasterTimeseriesOutputUnits OutputUnits { get; set; }

    public RasterTimeseriesCollectionVariable Variable { get; set; }

    public RasterTimeseriesFileFormat OutputExtension { get; set; }
}
