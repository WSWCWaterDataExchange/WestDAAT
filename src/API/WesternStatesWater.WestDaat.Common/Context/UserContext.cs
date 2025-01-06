namespace WesternStatesWater.WestDaat.Common.Context;

public class UserContext : ContextBase
{
    public Guid UserId { get; init; }
    
    public string ExternalAuthId { get; init; } = null!;
    
    public OrganizationRole[] OrganizationRoles { get; init; } = [];
}