namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class WaterAllocations
    {
        public string MethodUUID { get; set; }
        public string OrganizationUUID { get; set; }
        public string SiteUUID { get; set; }
        public string VariableSpecificUUID { get; set; }
        public DateTime AllocationApplicationDate { get; set; }
        public string AllocationAssociatedConsumptiveUseSiteIDs { get; set; }
        public string AllocationAssociatedWithdrawalSiteIDs { get; set; }
        public string AllocationBasisCV { get; set; }
        public string AllocationChangeApplicationIndicator { get; set; }
        public string AllocationCommunityWaterSupplySystem { get; set; }
        public double AllocationCropDutyAmount { get; set; }
        public DateTime AllocationExpirationDate { get; set; }
        public double AllocationFlow_CFS { get; set; }
        public string AllocationLegalStatusCV { get; set; }
        public string AllocationNativeID { get; set; }
        public string AllocationOwner { get; set; }
        public DateTime AllocationPriorityDate { get; set; }
        public string AllocationSDWISIdentifierCV { get; set; }
        public string AllocationTimeframeEnd { get; set; }
        public string AllocationTimeframeStart { get; set; }
        public string AllocationTypeCV { get; set; }
        public double AllocationVolume_AF { get; set; }
        public string[] BeneficialUseCategory { get; set; }
        public string CommunityWaterSupplySystem { get; set; }
        public string CropTypeCV { get; set; }
        public string CustomerTypeCV { get; set; }
        public DateTime DataPublicationDate { get; set; }
        public DateTime DataPublicationDOI { get; set; }
        public string ExemptOfVolumeFlowPriority { get; set; }
        public string GeneratedPowerCapacityMW { get; set; }
        public string IrrigatedAcreage { get; set; }
        public string IrrigationMethodCV { get; set; }
        public string LegacyAllocationIDs { get; set; }
        public string OwnerClassificationCV { get; set; }
        public string PopulationServed { get; set; }
        public string PowerType { get; set; }
        public string PrimaryUseCategory { get; set; }
        public string WaterAllocationNativeURL { get; set; }
    }
}
