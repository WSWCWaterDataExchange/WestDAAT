namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class MethodsDim
    {
        public MethodsDim()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
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
        public string WaDEDataMappingUrl { get; set; }

        public virtual ApplicableResourceType ApplicableResourceTypeCvNavigation { get; set; }
        public virtual DataQualityValue DataQualityValueCvNavigation { get; set; }
        public virtual MethodType MethodTypeCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
    }
}
