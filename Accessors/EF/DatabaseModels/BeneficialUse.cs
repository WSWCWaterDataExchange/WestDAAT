using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class BeneficialUse
    {
        public BeneficialUse()
        {
            AggBridgeBeneficialUsesFacts = new HashSet<AggBridgeBeneficialUsesFact>();
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFacts = new HashSet<AllocationAmountsFact>();
            AllocationBridgeBeneficialUsesFacts = new HashSet<AllocationBridgeBeneficialUsesFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
            SitesBridgeBeneficialUsesFacts = new HashSet<SitesBridgeBeneficialUsesFact>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }
        public string Usgscategory { get; set; }
        public string Naicscode { get; set; }
        public string WaDename { get; set; }

        public virtual ICollection<AggBridgeBeneficialUsesFact> AggBridgeBeneficialUsesFacts { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual ICollection<AllocationBridgeBeneficialUsesFact> AllocationBridgeBeneficialUsesFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
        public virtual ICollection<SitesBridgeBeneficialUsesFact> SitesBridgeBeneficialUsesFacts { get; set; }
    }
}
