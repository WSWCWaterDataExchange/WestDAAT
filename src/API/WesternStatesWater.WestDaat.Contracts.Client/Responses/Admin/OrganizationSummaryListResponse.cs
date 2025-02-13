namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class OrganizationSummaryListResponse : OrganizationLoadResponseBase
{
    public List<OrganizationSummaryItem> Organizations { get; set; }
}