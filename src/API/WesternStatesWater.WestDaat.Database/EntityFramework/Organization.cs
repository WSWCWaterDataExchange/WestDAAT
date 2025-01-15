namespace WesternStatesWater.WaDE.Database.EntityFramework;

public class Organization
{
    public Organization()
    {
        UserOrganizations = new HashSet<UserOrganization>();
    }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public virtual ICollection<UserOrganization> UserOrganizations { get; set; }
}
