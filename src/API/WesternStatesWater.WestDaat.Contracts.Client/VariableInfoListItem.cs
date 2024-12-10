namespace WesternStatesWater.WestDaat.Contracts.Client;

public class VariableInfoListItem
{
    public string WaDEVariableUuid { get; set; }
    public string Variable { get; set; }
    public string VariableSpecificType { get; set; }
    public string AmountUnit { get; set; }
    public string AggregationStatistic { get; set; }
    public decimal AggregationInterval { get; set; }
    public string AggregationIntervalUnit { get; set; }
    public string ReportYearStartMonth { get; set; }
    public string ReportYearType { get; set; }
}