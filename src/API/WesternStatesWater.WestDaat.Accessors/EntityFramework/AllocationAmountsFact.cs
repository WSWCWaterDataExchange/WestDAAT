using LinqKit;
using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class AllocationAmountsFact
    {
        public AllocationAmountsFact()
        {
            AllocationBridgeBeneficialUsesFact = new HashSet<AllocationBridgeBeneficialUsesFact>();
            AllocationBridgeSitesFact = new HashSet<AllocationBridgeSitesFact>();
        }

        public long AllocationAmountId { get; set; }
        public long OrganizationId { get; set; }
        public long VariableSpecificId { get; set; }
        public long MethodId { get; set; }
        public string PrimaryUseCategoryCV { get; set; }
        public long DataPublicationDateId { get; set; }
        public string DataPublicationDoi { get; set; }
        public string AllocationNativeId { get; set; }
        public long? AllocationApplicationDateID { get; set; }
        public long? AllocationPriorityDateID { get; set; }
        public long? AllocationExpirationDateID { get; set; }
        public string AllocationOwner { get; set; }
        public string AllocationBasisCv { get; set; }
        public string AllocationLegalStatusCv { get; set; }
        public string AllocationTypeCv { get; set; }
        [MaxLength(5)]
        public string AllocationTimeframeStart { get; set; }
        [MaxLength(5)]
        public string AllocationTimeframeEnd { get; set; }
        public double? AllocationCropDutyAmount { get; set; }
        public double? AllocationFlow_CFS { get; set; }
        public double? AllocationVolume_AF { get; set; }
        public long? PopulationServed { get; set; }
        public double? GeneratedPowerCapacityMW { get; set; }
        public double? IrrigatedAcreage { get; set; }
        public string AllocationCommunityWaterSupplySystem { get; set; }
        public string SdwisidentifierCV { get; set; }
        public string AllocationAssociatedWithdrawalSiteIds { get; set; }
        public string AllocationAssociatedConsumptiveUseSiteIds { get; set; }
        public string AllocationChangeApplicationIndicator { get; set; }
        public string LegacyAllocationIds { get; set; }
        public string WaterAllocationNativeUrl { get; set; }
        public string CropTypeCV { get; set; }
        public string IrrigationMethodCV { get; set; }
        public string CustomerTypeCV { get; set; }
        public string CommunityWaterSupplySystem { get; set; }
        public bool? ExemptOfVolumeFlowPriority { get; set; }
        public string PowerType { get; set; }
        public string OwnerClassificationCV { get; set; }

        public virtual DateDim AllocationApplicationDateNavigation { get; set; }
        public virtual WaterAllocationBasis AllocationBasisCvNavigation { get; set; }
        public virtual DateDim AllocationExpirationDateNavigation { get; set; }
        public virtual LegalStatus AllocationLegalStatusCvNavigation { get; set; }
        public virtual DateDim AllocationPriorityDateNavigation { get; set; }
        public virtual WaterAllocationType AllocationTypeCvNavigation { get; set; }
        public virtual DateDim DataPublicationDate { get; set; }
        public virtual MethodsDim Method { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual BeneficialUsesCV PrimaryBeneficialUse { get; set; }
        public virtual VariablesDim VariableSpecific { get; set; }
        public virtual CropType CropType { get; set; }
        public virtual CustomerType CustomerType { get; set; }
        public virtual SDWISIdentifier SDWISIdentifier { get; set; }
        public virtual IrrigationMethod IrrigationMethod { get; set; }
        public virtual PowerType PowerTypeCV { get; set; }
        public virtual OwnerClassificationCv OwnerClassification { get; set; }
        public virtual ICollection<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFact { get; set; }
        public virtual ICollection<AllocationBridgeSitesFact> AllocationBridgeSitesFact { get; set; }

        #region Filters
        public static ExpressionStarter<AllocationAmountsFact> HasBeneficialUses(List<string> beneficalUses)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationBridgeBeneficialUsesFact.Any(b =>
                    beneficalUses.Contains(
                        b.BeneficialUse.WaDEName.Length > 0 ? b.BeneficialUse.WaDEName : b.BeneficialUse.Name)));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasOwnerClassification(List<string> ownerClassifications)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => ownerClassifications.Contains(
                x.OwnerClassification.WaDEName.Length > 0 ? x.OwnerClassification.WaDEName : x.OwnerClassification.Name));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasWaterSourceTypes(List<string> waterSourceTypes)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationBridgeSitesFact.Any(
                sb => sb.Site.WaterSourceBridgeSitesFact.Any(
                    wsb => waterSourceTypes.Contains(
                        wsb.WaterSource.WaterSourceTypeCvNavigation.WaDEName.Length > 0 ? wsb.WaterSource.WaterSourceTypeCvNavigation.WaDEName : wsb.WaterSource.WaterSourceTypeCvNavigation.Name))));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasOrginizationStates(List<string> states)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => states.Contains(x.Organization.State));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasAllocationOwner(string allowcationOwner)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationOwner == allowcationOwner);

            return predicate;
        }

        #endregion
    }
}
