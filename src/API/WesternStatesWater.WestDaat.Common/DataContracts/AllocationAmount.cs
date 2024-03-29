namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class AllocationAmount
    {
        public long AllocationAmountId { get; set; }
        public List<string> BeneficialUses { get; set; }
        public string OwnerClassification { get; set; }
        public string CustomerType { get; set; }
        public DateTime? AllocationPriorityDate { get; set; }
        public double? AllocationFlowCfs { get; set; }
        public double? AllocationVolumeAf { get; set; }
        public string AllocationOwner { get; set; }
        public string OrganizationState { get; set; }
        public bool? ExemptOfVolumeFlowPriority { get; set; }

        public List<long> SiteIds { get; set; }
    }
}
