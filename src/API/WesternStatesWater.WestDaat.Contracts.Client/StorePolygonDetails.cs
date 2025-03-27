namespace WesternStatesWater.WestDaat.Contracts.Client;

public class StorePolygonDetails
{
    /// <summary>
    /// Polygon(s) in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string PolygonWkt { get; set; } = null!;

    public Common.DataContracts.PolygonType PolygonType { get; set; }
}
