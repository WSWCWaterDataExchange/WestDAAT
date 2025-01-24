using NetTopologySuite.Geometries;

namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class TimeSeriesView
{
    public long SiteId { get; init; }
    public string SiteUuid { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public Geometry Geometry { get; init; }
    public Geometry Point { get; init; }
    public string State { get; init; }
    public string PrimaryUseCategory { get; init; }
    public string VariableType { get; init; }
    public string SiteType { get; init; }
    public string WaterSourceType { get; init; }
}