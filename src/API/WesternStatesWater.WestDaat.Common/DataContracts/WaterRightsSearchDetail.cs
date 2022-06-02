namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class WaterRightsSearchDetail
    {
        public string WadeUuid { get; set; }
        //public string[] SiteUUIDs { get; set; }
        //public string[] SiteNames { get; set; }
        //public string AllocationNativeID { get; set; }
        public DateTime AllocationPriorityDate { get; set; }
        public string[] BeneficialUses { get; set; }
        public double? AllocationFlowCfs { get; set; }
        public double? AllocationVolumeAf { get; set; }
        public string AllocationLegalStatus { get; set; }
        public string OwnerClassification { get; set; }
    }
}