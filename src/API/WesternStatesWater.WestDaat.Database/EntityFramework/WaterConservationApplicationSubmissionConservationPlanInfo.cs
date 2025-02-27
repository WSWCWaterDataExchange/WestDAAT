namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionConservationPlanInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    // question: will the user re-enter a dollar amount, or should we ignore adding this field
    // and instead use the value WaterConservationApplicationEstimate.EstimatedCompensationDollars?
    public int FundingRequestDollarAmount { get; set; }

    public string FundingRequestJustification { get; set; } = null!;

    public string ConservationPlanDescription { get; set; } = null!;

    public string ConservationPlanAdditionalInfo { get; set; } = null!;
}
