namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserOrganizationLoadRequest : OrganizationLoadRequestBase
{
    public Guid UserId { get; set; }
}