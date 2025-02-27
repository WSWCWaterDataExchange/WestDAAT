namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionEstimationInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string EstimationSupplementaryDetails { get; set; } = null!;
}
