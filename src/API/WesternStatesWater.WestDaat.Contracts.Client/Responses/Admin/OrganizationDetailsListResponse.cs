namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class OrganizationDetailsListResponse : OrganizationLoadResponseBase
{
    public List<OrganizationListItem> Organizations { get; set; }
}