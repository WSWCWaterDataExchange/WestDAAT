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

    public int? CompensationRateDollars { get; set; }

    public CompensationRateUnits? Units { get; set; }
}
