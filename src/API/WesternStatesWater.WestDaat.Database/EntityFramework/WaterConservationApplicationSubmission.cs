namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmission
{
    public WaterConservationApplicationSubmission()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }

    public int CompensationRateDollars { get; set; }

    public Common.DataContracts.CompensationRateUnits CompensationRateUnits { get; set; }

    public DateTimeOffset? AcceptedDate { get; set; }

    public DateTimeOffset? RejectedDate { get; set; }

    public virtual WaterConservationApplication WaterConservationApplication { get; set; }
}
