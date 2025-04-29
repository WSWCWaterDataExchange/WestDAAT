using NetTopologySuite.Geometries;

namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public class OverlaysView
    {
        public string ReportingUnitUUID { get; init; }
        public string OverlayTypeWaDEName { get; init; }
        public string WaterSourceTypeWaDEName { get; init; }
        public string State { get; init; }
        public Geometry Geometry { get; init; }
    }
}