namespace WesternStatesWater.WestDaat.Contracts.Client;

public class MapPolygon
{
    public Guid? WaterConservationApplicationEstimateLocationId { get; set; } = null!;

    /// <summary>
    /// Polygon in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string PolygonWkt { get; set; } = null!;

    public Common.DataContracts.DrawToolType DrawToolType { get; set; }
}
