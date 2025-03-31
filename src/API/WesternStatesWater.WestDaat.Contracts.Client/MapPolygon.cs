namespace WesternStatesWater.WestDaat.Contracts.Client;

public class MapPolygon
{
    /// <summary>
    /// Polygon(s) in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string PolygonWkt { get; set; } = null!;

    public Common.DataContracts.DrawToolType DrawToolType { get; set; }
}
