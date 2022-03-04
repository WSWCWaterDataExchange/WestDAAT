namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class DateDim
    {
        public DateDim()
        {
            AggregatedAmountsFactDataPublicationDateNavigation = new HashSet<AggregatedAmountsFact>();
            AggregatedAmountsFactTimeframeEnd = new HashSet<AggregatedAmountsFact>();
            AggregatedAmountsFactTimeframeStart = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFactAllocationApplicationDateNavigation = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactAllocationExpirationDateNavigation = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactAllocationPriorityDateNavigation = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactDataPublicationDate = new HashSet<AllocationAmountsFact>();
            RegulatoryReportingUnitsFact = new HashSet<RegulatoryReportingUnitsFact>();
            SiteVariableAmountsFactDataPublicationDateNavigation = new HashSet<SiteVariableAmountsFact>();
            SiteVariableAmountsFactTimeframeEndNavigation = new HashSet<SiteVariableAmountsFact>();
            SiteVariableAmountsFactTimeframeStartNavigation = new HashSet<SiteVariableAmountsFact>();
        }

        public long DateId { get; set; }
        public DateTime Date { get; set; }
        public string Year { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactDataPublicationDateNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactTimeframeEnd { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactTimeframeStart { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationApplicationDateNavigation { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationExpirationDateNavigation { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationPriorityDateNavigation { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactDataPublicationDate { get; set; }
        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactDataPublicationDateNavigation { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactTimeframeEndNavigation { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactTimeframeStartNavigation { get; set; }
    }
}
