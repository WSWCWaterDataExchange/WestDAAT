namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationPermissionsGetRequest : PermissionsGetRequestBase
{
    required public Guid OrganizationId { get; init; }
}