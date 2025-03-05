namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationMemberUpdateRequest : OrganizationStoreRequestBase
{
    public Guid OrganizationId { get; set; }

    public Guid UserId { get; set; }

    public string Role { get; set; } = null!;
}