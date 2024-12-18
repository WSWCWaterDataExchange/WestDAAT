namespace WesternStatesWater.WestDaat.Contracts.Client;

public class AnalyticsSummaryInformationResponse
{
    public AnalyticsSummaryInformation[] AnalyticsSummaryInformations { get; set; }
    public DropdownOption[] DropdownOptions { get; set; }
    public int SelectedValue { get; set; }
}
