namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationMemberUpdateRequest : OrganizationStoreRequestBase
{
    required public Guid OrganizationId { get; set; }

    required public Guid UserId { get; set; }

    required public string Role { get; set; }
}