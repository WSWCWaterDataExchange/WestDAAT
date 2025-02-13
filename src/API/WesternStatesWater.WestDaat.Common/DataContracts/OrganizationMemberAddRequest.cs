namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationMemberAddRequest : OrganizationStoreRequestBase
{
    required public Guid OrganizationId { get; set; }

    required public Guid UserId { get; set; }

    required public string Role { get; set; }
}