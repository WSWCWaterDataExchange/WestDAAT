namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class Organization
{
    public Organization()
    {
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string EmailDomain { get; set; } = null!;

    public string AbbreviatedName { get; set; } = null!;

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}