namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OrganizationPermissionsGetRequest : PermissionsGetRequestBase
{
    public Guid OrganizationId { get; init; }
}