namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

public class OrganizationLoadAllResponse : OrganizationLoadResponseBase
{
    public List<OrganizationListItem> Organizations { get; set; }
}