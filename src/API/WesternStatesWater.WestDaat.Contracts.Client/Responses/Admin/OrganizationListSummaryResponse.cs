namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class OrganizationListSummaryResponse : OrganizationLoadResponseBase
{
    public List<OrganizationSummaryItem> Organizations { get; set; }
}