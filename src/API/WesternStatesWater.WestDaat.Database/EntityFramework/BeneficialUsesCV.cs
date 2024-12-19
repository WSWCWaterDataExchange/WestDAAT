namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class BeneficialUsesCV : ControlledVocabularyBase
    {
        public BeneficialUsesCV()
        {
            AggBridgeBeneficialUsesFact = new HashSet<AggBridgeBeneficialUsesFact>();
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            AllocationBridgeBeneficialUsesFact = new HashSet<AllocationBridgeBeneficialUsesFact>();
            SitesBridgeBeneficialUsesFact = new HashSet<SitesBridgeBeneficialUsesFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
        }
        
        public string UsgscategoryNameCv { get; set; }
        public string NaicscodeNameCv { get; set; }
        public Common.ConsumptionCategory? ConsumptionCategoryType { get; set; }

        public virtual ICollection<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFact { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFact { get; set; }
        public virtual ICollection<SitesBridgeBeneficialUsesFact> SitesBridgeBeneficialUsesFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }

    }
}
