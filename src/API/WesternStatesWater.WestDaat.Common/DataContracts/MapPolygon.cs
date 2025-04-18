﻿namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MapPolygon
{
    /// <summary>
    /// Polygon in "Well-known text" (WKT) format.
    /// <br />
    /// <see href="https://libgeos.org/specifications/wkt/">WKT Format Specification</see>.
    /// </summary>
    public string PolygonWkt { get; set; } = null!;

    public DrawToolType DrawToolType { get; set; }
}

