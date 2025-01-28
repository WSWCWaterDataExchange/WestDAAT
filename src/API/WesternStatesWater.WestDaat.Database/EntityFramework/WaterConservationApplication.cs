namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplication
{
    public WaterConservationApplication()
    {

    }

    public Guid Id { get; set; }

    public Guid ApplicantUserId { get; set; }

    public Guid FundingOrganizationId { get; set; }

    public virtual User ApplicantUser { get; set; }

    public virtual Organization FundingOrganization { get; set; }
}
