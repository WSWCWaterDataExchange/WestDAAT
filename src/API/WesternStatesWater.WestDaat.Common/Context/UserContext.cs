namespace WesternStatesWater.WestDaat.Common.Context;

public class UserContext : ContextBase
{
    public Guid UserId { get; init; }
    
    public string ExternalAuthId { get; init; } = null!;

    /// <summary>
    /// Roles that apply to all organizations.
    /// </summary>
    public string[] Roles { get; init; } = [];
    
    /// <summary>
    /// Roles that are specific to an organization.
    /// </summary>
    public OrganizationRole[] OrganizationRoles { get; init; } = [];
}