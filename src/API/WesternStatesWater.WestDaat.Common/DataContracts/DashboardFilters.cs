namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class DashboardFilters
    {
        public OverlayFilterSet Overlays { get; set; }
        public WaterRightsFilterSet WaterRights { get; set; }
        public TimeSeriesFilterSet TimeSeries { get; set; }
    }

    public class OverlayFilterSet
    {
        public string[] OverlayTypes { get; set; }
        public string[] WaterSourceTypes { get; set; }
        public string[] States { get; set; }
    }

    public class WaterRightsFilterSet
    {
        public BeneficialUseItem[] BeneficialUses { get; set; }
        public string[] OwnerClassifications { get; set; }
        public string[] AllocationTypes { get; set; }
        public string[] LegalStatuses { get; set; }
        public string[] SiteTypes { get; set; }
        public string[] WaterSourceTypes { get; set; }
        public string[] States { get; set; }
        public string[] RiverBasins { get; set; }
    }

    public class TimeSeriesFilterSet
    {
        public string[] SiteTypes { get; set; }
        public string[] PrimaryUseCategories { get; set; }
        public string[] VariableTypes { get; set; }
        public string[] WaterSourceTypes { get; set; }
        public string[] States { get; set; }
    }
}