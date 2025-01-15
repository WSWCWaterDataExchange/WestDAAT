namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class UserOrganizationRole
{
    public Guid Id { get; set; }

    public Guid UserOrganizationId { get; set; }

    public string Role { get; set; }

    public virtual UserOrganization UserOrganization { get; set; }
}
