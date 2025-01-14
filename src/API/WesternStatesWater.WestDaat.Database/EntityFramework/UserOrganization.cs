namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class UserOrganization
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid OrganizationId { get; set; }

    public virtual User User { get; set; }

    public virtual Organization Organization { get; set; }

}
