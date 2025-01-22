namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

/// <summary>
/// Response returning all organizations for global admins.
/// </summary>
public class OrganizationLoadAllResponse : OrganizationLoadResponseBase
{
    public List<OrganizationListItem> Organizations { get; set; }
}