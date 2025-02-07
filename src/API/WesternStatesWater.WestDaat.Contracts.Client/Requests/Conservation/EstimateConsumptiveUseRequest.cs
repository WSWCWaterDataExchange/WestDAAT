using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class EstimateConsumptiveUseRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    /// <summary>
    /// Polygon(s) in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string[] Polygons { get; set; }

    public RasterTimeSeriesModel Model { get; set; }

    /// <summary>
    /// The beginning year of the date range. Inclusive.
    /// </summary>
    public DateOnly DateRangeStart { get; set; }

    /// <summary>
    /// The ending year of the date range. Inclusive.
    /// </summary>
    public DateOnly DateRangeEnd { get; set; }

    public int? CompensationRateDollars { get; set; }

    public CompensationRateUnits? Units { get; set; }
}
