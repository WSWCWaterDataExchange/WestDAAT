namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class WaterRightDetails
    {
        public decimal AggregationInterval { get; set; }
        public string AggregationIntervalUnit { get; set; }
        public string AggregationStatistic { get; set; }
        public string AmountUnitCv { get; set; }
        public string ReportYearStartMonth { get; set; }
        public string ReportYearTypeCv { get; set; }
        public string VariableCv { get; set; }
        public string VariableSpecific { get; set; }

        public string OrganizationName { get; set; }
        public string State { get; set; }
        public string OrganizationWebsite { get; set; }

        public string ApplicableResourceType { get; set; }
        public string MethodType { get; set; }
        public string MethodLink { get; set; }
        public string MethodDescription { get; set; }
        public string WaDEDataMappingUrl { get; set; }

        public string AllocationUuid { get; set; }
        public string AllocationNativeId { get; set; }
        public string AllocationOwner { get; set; }
        public DateTime? PriorityDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string AllocationLegalStatus { get; set; }
        public double? AllocationFlowCfs { get; set; }
        public double? AllocationVolumeAF { get; set; }
        public List<string> BeneficialUses { get; set; }

        public DateTime? DatePublished { get; set; }
        public string AllocationTimeframeStart { get; set; }
        public string AllocationTimeframeEnd { get; set; }
        public double? AllocationCropDutyAmount { get; set; }
        public string WaterAllocationNativeUrl { get; set; }
        public string OwnerClassificationCV { get; set; }
        public string PrimaryBeneficialUseCategory { get; set; }
        public string IrrigationMethodCV { get; set; }
        public double? IrrigatedAcreage { get; set; }
        public string CropTypeCV { get; set; }
        public string WaDEIrrigationMethod { get; set; }

    }
}
