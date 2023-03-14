namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class WaterAllocations
    {
        public string MethodUuid { get; set; }
        public string OrganizationUuid { get; set; }
        public string SiteUuid { get; set; } 
        public string VariableSpecificUuid { get; set; }
        public string AllocationUuid { get; set; }
        public DateTime? AllocationApplicationDate { get; set; }
        public string AllocationAssociatedConsumptiveUseSiteIds { get; set; }
        public string AllocationAssociatedWithdrawalSiteIds { get; set; }
        public string AllocationBasisCv { get; set; }
        public string AllocationChangeApplicationIndicator { get; set; }
        public string AllocationCommunityWaterSupplySystem { get; set; }
        public double? AllocationCropDutyAmount { get; set; }
        public DateTime? AllocationExpirationDate { get; set; }
        public double? AllocationFlow_CFS { get; set; }
        public string AllocationLegalStatusCV { get; set; }
        public string AllocationNativeID { get; set; }
        public string AllocationOwner { get; set; }
        public DateTime? AllocationPriorityDate { get; set; }
        public string AllocationSDWISIdentifierCV { get; set; }
        public string AllocationTimeframeEnd { get; set; }
        public string AllocationTimeframeStart { get; set; }
        public string AllocationTypeCv { get; set; }
        public double? AllocationVolume_AF { get; set; }
        public string BeneficialUseCategory { get; set; }
        public string CommunityWaterSupplySystem { get; set; }
        public string CropTypeCv { get; set; }
        public string CustomerTypeCv { get; set; }
        public DateTime? DataPublicationDate { get; set; }
        public string DataPublicationDoi { get; set; }
        public string ExemptOfVolumeFlowPriority { get; set; }
        public string GeneratedPowerCapacityMW { get; set; }
        public string IrrigatedAcreage { get; set; }
        public string IrrigationMethodCv { get; set; }
        public string LegacyAllocationIds { get; set; }
        public string OwnerClassificationCv { get; set; }
        public string PopulationServed { get; set; }
        public string PowerType { get; set; }
        public string PrimaryBeneficialUseCategory { get; set; }
        public string WaterAllocationNativeUrl { get; set; }
    }
}
