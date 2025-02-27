namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionWaterRightInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string PermitNumber { get; set; } = null!;

    public string FacilityDitchName { get; set; } = null!;

    public DateOnly PriorityDate { get; set; }

    public string CertificateNumber { get; set; } = null!;

    // question: in the mockups this displays "share #'s"; will there be multiple share numbers? if so we may need another contract
    public string ShareNumber { get; set; } = null!;

    public string WaterRightState { get; set; } = null!;

    public string WaterUseDescription { get; set; } = null!;
}
