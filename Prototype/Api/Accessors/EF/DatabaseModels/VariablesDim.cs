using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class VariablesDim
    {
        public VariablesDim()
        {
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFacts = new HashSet<AllocationAmountsFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public long VariableSpecificId { get; set; }
        public string VariableSpecificCv { get; set; }
        public string VariableCv { get; set; }
        public string AggregationStatisticCv { get; set; }
        public decimal AggregationInterval { get; set; }
        public string AggregationIntervalUnitCv { get; set; }
        public string ReportYearStartMonth { get; set; }
        public string ReportYearTypeCv { get; set; }
        public string AmountUnitCv { get; set; }
        public string MaximumAmountUnitCv { get; set; }
        public string VariableSpecificUuid { get; set; }

        public virtual Unit AggregationIntervalUnitCvNavigation { get; set; }
        public virtual AggregationStatistic AggregationStatisticCvNavigation { get; set; }
        public virtual Unit AmountUnitCvNavigation { get; set; }
        public virtual Unit MaximumAmountUnitCvNavigation { get; set; }
        public virtual ReportYearType ReportYearTypeCvNavigation { get; set; }
        public virtual Variable VariableCvNavigation { get; set; }
        public virtual VariableSpecific VariableSpecificCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
