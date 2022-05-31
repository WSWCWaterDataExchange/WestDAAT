namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class SiteDetails
    {
        public decimal AggregationInterval { get; set; }
        public string AggregationIntervalUnit { get; set; }
        public string AggregationStatistic { get; set; }
        public string AmountUnitCv { get; set; }
        public string ReportYearStartMonth { get; set; }
        public string ReportYearTypeCv { get; set; }
        public string VariableCv { get; set; }
        public string VariableSpecific { get; set; }

        public string OrganizationName { get; set; }
        public string State { get; set; }
        public string OrganizationWebsite { get; set; }
    }
}
