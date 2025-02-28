namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationSubmissionRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

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

    public Common.DataContracts.CompensationRateUnits ConservationPlanFundingRequestCompensationRateUnits { get; set; }

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

    public string ShareNumber { get; set; } = null!;

    public string WaterRightState { get; set; } = null!;

    public string WaterUseDescription { get; set; } = null!;

}
