using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class AllocationAmountsFact
    {
        public AllocationAmountsFact()
        {
            AllocationBridgeBeneficialUsesFacts = new HashSet<AllocationBridgeBeneficialUsesFact>();
            AllocationBridgeSitesFacts = new HashSet<AllocationBridgeSitesFact>();
        }

        public long AllocationAmountId { get; set; }
        public long OrganizationId { get; set; }
        public long VariableSpecificId { get; set; }
        public long MethodId { get; set; }
        public string PrimaryUseCategoryCv { get; set; }
        public long DataPublicationDateId { get; set; }
        public string DataPublicationDoi { get; set; }
        public string AllocationNativeId { get; set; }
        public long? AllocationApplicationDateId { get; set; }
        public long? AllocationPriorityDateId { get; set; }
        public long? AllocationExpirationDateId { get; set; }
        public string AllocationOwner { get; set; }
        public string AllocationBasisCv { get; set; }
        public string AllocationLegalStatusCv { get; set; }
        public string AllocationTypeCv { get; set; }
        public double? AllocationCropDutyAmount { get; set; }
        public double? AllocationFlowCfs { get; set; }
        public double? AllocationVolumeAf { get; set; }
        public long? PopulationServed { get; set; }
        public double? GeneratedPowerCapacityMw { get; set; }
        public double? IrrigatedAcreage { get; set; }
        public string AllocationCommunityWaterSupplySystem { get; set; }
        public string SdwisidentifierCv { get; set; }
        public string AllocationAssociatedWithdrawalSiteIds { get; set; }
        public string AllocationAssociatedConsumptiveUseSiteIds { get; set; }
        public string AllocationChangeApplicationIndicator { get; set; }
        public string LegacyAllocationIds { get; set; }
        public string WaterAllocationNativeUrl { get; set; }
        public string CropTypeCv { get; set; }
        public string IrrigationMethodCv { get; set; }
        public string CustomerTypeCv { get; set; }
        public string CommunityWaterSupplySystem { get; set; }
        public string PowerType { get; set; }
        public string AllocationTimeframeStart { get; set; }
        public string AllocationTimeframeEnd { get; set; }
        public bool? ExemptOfVolumeFlowPriority { get; set; }
        public string OwnerClassificationCV { get; set; }

        public virtual DateDim AllocationApplicationDate { get; set; }
        public virtual WaterAllocationBasis AllocationBasisCvNavigation { get; set; }
        public virtual DateDim AllocationExpirationDate { get; set; }
        public virtual LegalStatus AllocationLegalStatusCvNavigation { get; set; }
        public virtual DateDim AllocationPriorityDate { get; set; }
        public virtual WaterAllocationType AllocationTypeCvNavigation { get; set; }
        public virtual CropType CropTypeCvNavigation { get; set; }
        public virtual CustomerType CustomerTypeCvNavigation { get; set; }
        public virtual DateDim DataPublicationDate { get; set; }
        public virtual IrrigationMethod IrrigationMethodCvNavigation { get; set; }
        public virtual MethodsDim Method { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual PowerType PowerTypeNavigation { get; set; }
        public virtual BeneficialUse PrimaryUseCategoryCvNavigation { get; set; }
        public virtual Sdwisidentifier SdwisidentifierCvNavigation { get; set; }
        public virtual VariablesDim VariableSpecific { get; set; }
        public virtual ICollection<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFacts { get; set; }
        public virtual ICollection<AllocationBridgeSitesFact> AllocationBridgeSitesFacts { get; set; }
    }
}
