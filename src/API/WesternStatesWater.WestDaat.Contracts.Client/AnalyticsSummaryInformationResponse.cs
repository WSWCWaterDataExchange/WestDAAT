namespace WesternStatesWater.WestDaat.Contracts.Client;

public class AnalyticsSummaryInformationResponse
{
    public AnalyticsSummaryInformation[] AnalyticsSummaryInformation { get; set; }
    public GroupItem[] GroupItems { get; set; }
    public int GroupValue { get; set; }
}
