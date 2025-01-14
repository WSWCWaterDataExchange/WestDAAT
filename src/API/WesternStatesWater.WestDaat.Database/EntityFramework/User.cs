namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class User
{
    public User()
    {
        UserRoles = new HashSet<UserRole>();
        UserOrganizationRoles = new HashSet<UserOrganizationRole>();
    }

    public Guid Id { get; set; }

    public string Email { get; set; }

    public string ExternalAuthId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public virtual ICollection<UserRole> UserRoles { get; set; }

    public virtual ICollection<UserOrganizationRole> UserOrganizationRoles { get; set; }
}
