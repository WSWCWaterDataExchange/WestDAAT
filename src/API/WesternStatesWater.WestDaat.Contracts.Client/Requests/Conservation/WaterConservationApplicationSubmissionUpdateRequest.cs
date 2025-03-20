namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationSubmissionUpdateRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public string AgentName { get; set; } = null!;

    public string AgentEmail { get; set; } = null!;

    public string AgentPhoneNumber { get; set; } = null!;

    public string AgentAdditionalDetails { get; set; } = null!;

    public string LandownerName { get; set; } = null!;

    public string LandownerEmail { get; set; } = null!;

    public string LandownerPhoneNumber { get; set; } = null!;

    public string LandownerAddress { get; set; } = null!;

    public string LandownerCity { get; set; } = null!;

    public string LandownerState { get; set; } = null!;

    public string LandownerZipCode { get; set; } = null!;

    public string CanalOrIrrigationEntityName { get; set; } = null!;

    public string CanalOrIrrigationEntityEmail { get; set; } = null!;

    public string CanalOrIrrigationEntityPhoneNumber { get; set; } = null!;

    public string CanalOrIrrigationAdditionalDetails { get; set; } = null!;

    public int ConservationPlanFundingRequestDollarAmount { get; set; }

    public Common.DataContracts.CompensationRateUnits ConservationPlanFundingRequestCompensationRateUnits { get; set; }

    public string ConservationPlanDescription { get; set; } = null!;

    public string ConservationPlanAdditionalInfo { get; set; } = null!;

    public string EstimationSupplementaryDetails { get; set; } = null!;

    public string PermitNumber { get; set; } = null!;

    public string FacilityDitchName { get; set; } = null!;

    public DateOnly PriorityDate { get; set; }

    public string CertificateNumber { get; set; } = null!;

    public string ShareNumber { get; set; } = null!;

    public string WaterRightState { get; set; } = null!;

    public string WaterUseDescription { get; set; } = null!;

    public string Note { get; set; } = null!;

    public ApplicationSubmissionFieldDetail[] FieldDetails { get; set; } = null!;

    public WaterConservationApplicationDocument[] SupportingDocuments { get; set; } = null!;
}