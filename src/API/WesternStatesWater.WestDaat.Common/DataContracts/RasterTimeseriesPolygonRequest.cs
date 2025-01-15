using System.Text.Json.Serialization;
using WesternStatesWater.WestDaat.Common.DataContracts.Converters;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

[JsonConverter(typeof(RasterTimeSeriesPolygonRequestConverter))]
public class RasterTimeSeriesPolygonRequest
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

    public RasterTimeSeriesInterval Interval { get; set; }

    public RasterTimeSeriesModel Model { get; set; }

    public RasterTimeSeriesPixelReducer PixelReducer { get; set; }

    public RasterTimeSeriesReferenceEt ReferenceEt { get; set; }

    public RasterTimeSeriesOutputUnits OutputUnits { get; set; }

    public RasterTimeSeriesCollectionVariable Variable { get; set; }

    public RasterTimeSeriesFileFormat OutputExtension { get; set; }
}
