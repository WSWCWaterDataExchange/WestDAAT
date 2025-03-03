namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationMemberRemoveRequest : OrganizationStoreRequestBase
{
    required public Guid OrganizationId { get; set; }

    required public Guid UserId { get; set; }
}