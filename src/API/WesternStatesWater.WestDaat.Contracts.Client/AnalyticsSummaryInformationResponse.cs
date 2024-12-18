namespace WesternStatesWater.WestDaat.Contracts.Client;

public class AnalyticsSummaryInformationResponse
{
    public AnalyticsSummaryInformation[] AnalyticsSummaryInformations { get; set; }
    public GroupItem[] DropdownOptions { get; set; }
    public int SelectedValue { get; set; }
}
