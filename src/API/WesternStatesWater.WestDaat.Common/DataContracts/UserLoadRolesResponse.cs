namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserLoadRolesResponse
{
    public Guid UserId { get; set; }
    public string[] UserRoles { get; set; }
    public string[] UserOrganizationRoles { get; set; }
}
