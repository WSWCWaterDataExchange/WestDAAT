using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework;

public class AllocationAmountsView
{
    public long SiteId { get; init; }
    public string Owners { get; init; }
    public string OwnerClassifications { get; init; }
    public string BeneficalUses { get; init; }
    public string SiteUuid { get; init; }
    public string PodPou { get; init; }
    public string WaterSources { get; init; }
    public string States { get; init; }
    public bool ExemptOfVolumeFlowPriority { get; init; }
    public double? MinCfsFlow { get; init; }
    public double? MaxCfsFlow { get; init; }
    public double? MinAfVolume { get; init; }
    public double? MaxAfVolume { get; init; }
    public Geometry Geometry { get; init; }
    public DateTime? MinPriorityDate { get; init; }
    public DateTime? MaxPriorityDate { get; init; }
    public Geometry Point { get; init; }
}