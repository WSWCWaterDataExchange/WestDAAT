namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MapPoint
{
    /// <summary>
    /// Point in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string PointWkt { get; set; } = null!;
}
