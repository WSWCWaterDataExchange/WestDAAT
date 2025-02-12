namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserOrganizationLoadRequest : OrganizationLoadRequestBase
{
    required public Guid UserId { get; init; }
}