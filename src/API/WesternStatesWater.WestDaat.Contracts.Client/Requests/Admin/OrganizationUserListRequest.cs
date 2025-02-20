namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationUserListRequest : UserLoadRequestBase
{
    public Guid OrganizationId { get; set; }
}