using NetTopologySuite.Geometries;

namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class TimeSeriesView
{
    public long SiteId { get; init; }
    public string SiteUuid { get; init; }
    public string PodPou { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public Geometry Geometry { get; init; }
    public Geometry Point { get; init; }

}