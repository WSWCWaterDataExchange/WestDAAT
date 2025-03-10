namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class UserOrganizationRole
{
    public Guid Id { get; set; }

    public Guid UserOrganizationId { get; set; }

    public string Role { get; set; } = null!;

    public virtual UserOrganization UserOrganization { get; set; } = null!;
}
