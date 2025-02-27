namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionConservationPlanInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public int FundingRequestDollarAmount { get; set; }

    public string ConservationPlanDescription { get; set; } = null!;

    public string ConservationPlanAdditionalInfo { get; set; } = null!;
}
