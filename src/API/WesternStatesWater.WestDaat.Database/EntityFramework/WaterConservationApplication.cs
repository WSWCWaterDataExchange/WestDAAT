namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplication
{
    public WaterConservationApplication()
    {

    }

    public Guid Id { get; set; }

    public Guid ApplicantUserId { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }

    public int CompensationRateDollars { get; set; }

    public Common.DataContracts.CompensationRateUnits CompensationRateUnits { get; set; }

    public string ApplicationDisplayId { get; set; }

    public string WaterRightNativeId { get; set; }

    public Guid OrganizationId { get; set; }

    public DateTimeOffset? AcceptedDate { get; set; }

    public DateTimeOffset? RejectedDate { get; set; }

    public virtual User ApplicantUser { get; set; }

    public virtual Organization Organization { get; set; }
}
