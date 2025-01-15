using NetTopologySuite.Geometries;

namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class OverlaysView
{
    public string ReportingUnitUUID { get; init; }
    public string RegulatoryOverlayTypeWaDEName { get; init; }
    public Geometry Geometry { get; init; }
}