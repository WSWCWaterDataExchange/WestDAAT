using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class DateDim
    {
        public DateDim()
        {
            AggregatedAmountsFactDataPublicationDates = new HashSet<AggregatedAmountsFact>();
            AggregatedAmountsFactTimeframeEnds = new HashSet<AggregatedAmountsFact>();
            AggregatedAmountsFactTimeframeStarts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFactAllocationApplicationDates = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactAllocationExpirationDates = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactAllocationPriorityDates = new HashSet<AllocationAmountsFact>();
            AllocationAmountsFactDataPublicationDates = new HashSet<AllocationAmountsFact>();
            RegulatoryReportingUnitsFacts = new HashSet<RegulatoryReportingUnitsFact>();
            SiteVariableAmountsFactDataPublicationDates = new HashSet<SiteVariableAmountsFact>();
            SiteVariableAmountsFactTimeframeEnds = new HashSet<SiteVariableAmountsFact>();
            SiteVariableAmountsFactTimeframeStarts = new HashSet<SiteVariableAmountsFact>();
        }

        public long DateId { get; set; }
        public DateTime Date { get; set; }
        public string Year { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactDataPublicationDates { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactTimeframeEnds { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFactTimeframeStarts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationApplicationDates { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationExpirationDates { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactAllocationPriorityDates { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFactDataPublicationDates { get; set; }
        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactDataPublicationDates { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactTimeframeEnds { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFactTimeframeStarts { get; set; }
    }
}
