namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class RolePermissionsGetRequest : PermissionsGetRequestBase
{
    public string Role { get; init; } = null!;
}