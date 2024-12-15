namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class ReportingUnitsDim
    {
        public ReportingUnitsDim()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            RegulatoryReportingUnitsFact = new HashSet<RegulatoryReportingUnitsFact>();
        }

        public long ReportingUnitId { get; set; }
        public string ReportingUnitUuid { get; set; }
        public string ReportingUnitNativeId { get; set; }
        public string ReportingUnitName { get; set; }
        public string ReportingUnitTypeCv { get; set; }
        public DateTime? ReportingUnitUpdateDate { get; set; }
        public string ReportingUnitProductVersion { get; set; }
        public string StateCv { get; set; }
        public string EpsgcodeCv { get; set; }
        public Geometry Geometry { get; set; }

        public virtual Epsgcode EpsgcodeCvNavigation { get; set; }
        public virtual ReportingUnitType ReportingUnitTypeCvNavigation { get; set; }
        public virtual State StateCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFact { get; set; }
    }
}
