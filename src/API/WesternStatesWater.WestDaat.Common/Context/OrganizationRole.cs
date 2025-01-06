namespace WesternStatesWater.WestDaat.Common.Context;

public class OrganizationRole
{
    public Guid OrganizationId { get; init; }
    
    public string[] RoleNames { get; init; } = null!;
}