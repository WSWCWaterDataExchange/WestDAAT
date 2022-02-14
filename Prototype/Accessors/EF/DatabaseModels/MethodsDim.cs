using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class MethodsDim
    {
        public MethodsDim()
        {
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFacts = new HashSet<AllocationAmountsFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public long MethodId { get; set; }
        public string MethodUuid { get; set; }
        public string MethodName { get; set; }
        public string MethodDescription { get; set; }
        public string MethodNemilink { get; set; }
        public string ApplicableResourceTypeCv { get; set; }
        public string MethodTypeCv { get; set; }
        public string DataCoverageValue { get; set; }
        public string DataQualityValueCv { get; set; }
        public string DataConfidenceValue { get; set; }

        public virtual ApplicableResourceType ApplicableResourceTypeCvNavigation { get; set; }
        public virtual DataQualityValue DataQualityValueCvNavigation { get; set; }
        public virtual MethodType MethodTypeCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
