namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class WaterRightsSearchDetail
    {
        public string AllocationUuid { get; set; }
        public DateTime? AllocationPriorityDate { get; set; }
        public string[] BeneficialUses { get; set; }
        public double? AllocationFlowCfs { get; set; }
        public double? AllocationVolumeAf { get; set; }
        public string AllocationLegalStatus { get; set; }
        public string OwnerClassification { get; set; }
        public string AllocationOwner { get; set; }
    }
}