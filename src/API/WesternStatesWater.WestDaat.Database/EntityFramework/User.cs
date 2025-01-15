namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class User
{
    public User()
    {
        UserRoles = new HashSet<UserRole>();
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Email { get; set; }

    public string ExternalAuthId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; }

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}
