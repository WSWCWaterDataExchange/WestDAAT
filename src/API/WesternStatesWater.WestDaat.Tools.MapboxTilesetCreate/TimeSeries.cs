using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

public class TimeSeries
{
    public long SiteId { get; set; }
    public long SiteVariableAmountId { get; set; }
    public required string SiteUuid { get; set; }
    public required string State { get; set; }
    public required string SiteType { get; set; }
    public required Geometry Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? PrimaryUseCagtegory { get; set; }
    public string? VariableType { get; set; }
    public string? WaterSourceType { get; set; }
}