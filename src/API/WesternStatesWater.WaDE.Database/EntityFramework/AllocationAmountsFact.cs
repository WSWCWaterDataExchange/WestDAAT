using LinqKit;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Utilities;
using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class AllocationAmountsFact
    {
        public AllocationAmountsFact()
        {
            AllocationBridgeBeneficialUsesFact = new HashSet<AllocationBridgeBeneficialUsesFact>();
            AllocationBridgeSitesFact = new HashSet<AllocationBridgeSitesFact>();
        }
        public string AllocationUuid { get; set; }
        public long AllocationAmountId { get; set; }
        public long OrganizationId { get; set; }
        public long VariableSpecificId { get; set; }
        public long MethodId { get; set; }
        public string PrimaryBeneficialUseCategory { get; set; }
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
        public Guid? ConservationApplicationFundingOrganizationId { get; set; }

        public virtual DateDim AllocationApplicationDateNavigation { get; set; }
        public virtual WaterAllocationBasis AllocationBasisCvNavigation { get; set; }
        public virtual DateDim AllocationExpirationDateNavigation { get; set; }
        public virtual LegalStatus AllocationLegalStatusCvNavigation { get; set; }
        public virtual DateDim AllocationPriorityDateNavigation { get; set; }
        public virtual WaterAllocationType AllocationTypeCvNavigation { get; set; }
        public virtual DateDim DataPublicationDate { get; set; }
        public virtual MethodsDim Method { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
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
        public static ExpressionStarter<AllocationAmountsFact> HasSitesUuids(DatabaseContext db)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationBridgeSitesFact.Any(b => db.TempId.Any(c => c.Id == b.SiteId)));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasBeneficialUses(List<string> beneficalUses)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            //Not sure this is correct.  It should probably be searching the beneficial uses bridge table
            predicate = predicate.Or(x => beneficalUses.Contains(x.PrimaryBeneficialUseCategory));

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

        public static ExpressionStarter<AllocationAmountsFact> HasOrganizationStates(List<string> states)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => states.Contains(x.Organization.State));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasAllocationOwner(string allowcationOwner)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationOwner.Contains(allowcationOwner));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> IsExemptOfVolumeFlowPriority(bool isExempt)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => (x.ExemptOfVolumeFlowPriority ?? false) == isExempt);

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasFlowRateRange(double? minimumFlow, double? maximumFlow)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            if (minimumFlow.HasValue && maximumFlow.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationFlow_CFS >= minimumFlow && x.AllocationFlow_CFS <= maximumFlow);
            }
            else if (minimumFlow.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationFlow_CFS >= minimumFlow);
            }
            else if (maximumFlow.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationFlow_CFS <= maximumFlow);
            }

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasVolumeRange(double? minimumVolume, double? maximumVolume)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            if (minimumVolume.HasValue && maximumVolume.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationVolume_AF >= minimumVolume && x.AllocationVolume_AF <= maximumVolume);
            }
            else if (minimumVolume.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationVolume_AF >= minimumVolume);
            }
            else if (maximumVolume.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationVolume_AF <= maximumVolume);
            }

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> HasPriorityDateRange(DateTime? minimumPriorityDate, DateTime? maximumPriorityDate)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            if (minimumPriorityDate.HasValue && maximumPriorityDate.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationPriorityDateID != null && x.AllocationPriorityDateNavigation.Date >= minimumPriorityDate && x.AllocationPriorityDateNavigation.Date <= maximumPriorityDate);
            }
            else if (minimumPriorityDate.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationPriorityDateID != null && x.AllocationPriorityDateNavigation.Date >= minimumPriorityDate);
            }
            else if (maximumPriorityDate.HasValue)
            {
                predicate = predicate.Or(x => x.AllocationPriorityDateID != null && x.AllocationPriorityDateNavigation.Date <= maximumPriorityDate);
            }

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> IsPodOrPou(string podOrPou)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationBridgeSitesFact.Any(abs => abs.Site.PODorPOUSite == podOrPou));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> IsWithinGeometry(params Geometry[] geometries)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            if (geometries.Length == 0)
            {
                return predicate;
            }

            var geometryCombined = GeometryCombiner.Combine(geometries);

            if (!geometryCombined.IsValid)
            {
                geometryCombined = GeometryFixer.Fix(geometryCombined, true);
            }

            predicate = predicate.Or(a => a.AllocationBridgeSitesFact.Any(site =>
            site.Site.Geometry != null && site.Site.Geometry.Intersects(geometryCombined)));

            predicate = predicate.Or(a => a.AllocationBridgeSitesFact.Any(site =>
            site.Site.SitePoint != null && site.Site.SitePoint.Intersects(geometryCombined)));

            return predicate;
        }

        public static ExpressionStarter<AllocationAmountsFact> IsAllocationNativeId(string allocationNativeId)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate = predicate.Or(x => x.AllocationNativeId == allocationNativeId);

            return predicate;
        }

        #endregion
    }
}
