namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class Organization
{
    public Organization()
    {
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public string EmailDomain { get; set; }

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}