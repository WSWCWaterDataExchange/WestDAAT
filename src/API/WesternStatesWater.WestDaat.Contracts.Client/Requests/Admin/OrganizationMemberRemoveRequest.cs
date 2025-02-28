namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationMemberRemoveRequest : OrganizationStoreRequestBase
{
    public Guid OrganizationId { get; set; }

    public Guid UserId { get; set; }
}