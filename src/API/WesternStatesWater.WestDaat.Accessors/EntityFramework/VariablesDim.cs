namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class VariablesDim
    {
        public VariablesDim()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
        }

        public long VariableSpecificId { get; set; }
        public string VariableSpecificUuid { get; set; }
        public string VariableSpecificCv { get; set; }
        public string VariableCv { get; set; }
        public string AggregationStatisticCv { get; set; }
        public decimal AggregationInterval { get; set; }
        public string AggregationIntervalUnitCv { get; set; }
        public string ReportYearStartMonth { get; set; }
        public string ReportYearTypeCv { get; set; }
        public string AmountUnitCv { get; set; }
        public string MaximumAmountUnitCv { get; set; }

        public virtual Units AggregationIntervalUnitCvNavigation { get; set; }
        public virtual AggregationStatistic AggregationStatisticCvNavigation { get; set; }
        public virtual Units AmountUnitCvNavigation { get; set; }
        public virtual Units MaximumAmountUnitCvNavigation { get; set; }
        public virtual ReportYearType ReportYearTypeCvNavigation { get; set; }
        public virtual Variable VariableCvNavigation { get; set; }
        public virtual VariableSpecific VariableSpecificCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
    }
}
