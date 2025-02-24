using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

public class TimeSeries
{
    public long SiteId { get; set; }
    public long SiteVariableAmountId { get; set; }
    public string SiteUuid { get; set; }
    public string State { get; set; }
    public string SiteType { get; set; }
    public Geometry Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string PrimaryUseCagtegory { get; set; }
    public string VariableType { get; set; }
    public string WaterSourceType { get; set; }
}