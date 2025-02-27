namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmission
{
    public WaterConservationApplicationSubmission()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }

    public DateTimeOffset? AcceptedDate { get; set; }

    public DateTimeOffset? RejectedDate { get; set; }

    public string AgentFirstName { get; set; } = null!;

    public string AgentLastName { get; set; } = null!;

    public string AgentEmail { get; set; } = null!;

    public string AgentPhoneNumber { get; set; } = null!;

    public string LandownerFirstName { get; set; } = null!;

    public string LandownerLastName { get; set; } = null!;

    public string LandownerEmail { get; set; } = null!;

    public string LandownerPhoneNumber { get; set; } = null!;

    public string LandownerAddress { get; set; } = null!;

    public string LandownerCity { get; set; } = null!;

    public string LandownerState { get; set; } = null!;

    public string LandownerZipCode { get; set; } = null!;

    public string CanalOrIrrigationEntityName { get; set; } = null!;

    public string CanalOrIrrigationEntityEmail { get; set; } = null!;

    public string CanalOrIrrigationEntityPhoneNumber { get; set; } = null!;

    public int ConservationPlanFundingRequestDollarAmount { get; set; }

    public string ConservationPlanDescription { get; set; } = null!;

    public string ConservationPlanAdditionalInfo { get; set; } = null!;

    public string EstimationSupplementaryDetails { get; set; } = null!;

    public string ProjectLocation { get; set; } = null!;

    public string PropertyAdditionalDetails { get; set; } = null!;

    public string DiversionPoint { get; set; } = null!;

    public string DiversionPointDetails { get; set; } = null!;

    public string PermitNumber { get; set; } = null!;

    public string FacilityDitchName { get; set; } = null!;

    public DateOnly PriorityDate { get; set; }

    public string CertificateNumber { get; set; } = null!;

    // question: in the mockups this displays "share #'s"; will there be multiple share numbers? if so we may need another contract
    public string ShareNumber { get; set; } = null!;

    public string WaterRightState { get; set; } = null!;

    public string WaterUseDescription { get; set; } = null!;



    public virtual WaterConservationApplication WaterConservationApplication { get; set; } = null!;
}
