namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class DashboardFilters
{
    public BeneficialUseItem[] BeneficialUses { get; set; }
    public string[] WaterSources { get; set; }
    public string[] Overlays { get; set; }
    public string[] OwnerClassifications { get; set; }
    public string[] States { get; set; }
    public string[] AllocationTypes { get; set; }
    public string[] LegalStatuses { get; set; }
    public string[] SiteTypes { get; set; }
    public string[] RiverBasins { get; set; }
}