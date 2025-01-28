namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class User
{
    public User()
    {
        UserRoles = new HashSet<UserRole>();
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string ExternalAuthId { get; set; } = null!;

    public DateTimeOffset CreatedAt { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; }

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}
