namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class OrganizationListDetailsResponse : OrganizationLoadResponseBase
{
    public List<OrganizationListItem> Organizations { get; set; }
}