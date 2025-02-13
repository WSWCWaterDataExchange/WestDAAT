namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationPermissionsGetRequest : PermissionsGetRequestBase
{
    /// <summary>
    /// The organization id to get permissions for. If null, permissions are returned for any organization.
    /// </summary>
    required public Guid? OrganizationId { get; init; }
}