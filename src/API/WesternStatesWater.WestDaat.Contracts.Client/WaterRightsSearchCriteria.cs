namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class WaterRightsSearchCriteria
    {
        public string[] BeneficialUses { get; set; }
        public string[] OwnerClassifications { get; set; }
        public string[] WaterSourceTypes { get; set; }
        public string[] RiverBasinNames { get; set; }
        public string[] WadeSitesUuids { get; set; }

        // Geojson string
        public string[] FilterGeometry { get; set; }

        public string[] States { get; set; }
        public string AllocationOwner { get; set; }
        public bool? ExemptOfVolumeFlowPriority { get; set; }
        public double? MinimumFlow { get; set; }
        public double? MaximumFlow { get; set; }
        public double? MinimumVolume { get; set; }
        public double? MaximumVolume { get; set; }
        public string PodOrPou { get; set; }
        public DateTime? MinimumPriorityDate { get; set; }
        public DateTime? MaximumPriorityDate { get; set; }
    }
}
