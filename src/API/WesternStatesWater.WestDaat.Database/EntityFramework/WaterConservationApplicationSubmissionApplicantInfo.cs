namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionApplicantInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string LandownerFirstName { get; set; } = null!;

    public string LandownerLastName { get; set; } = null!;

    public string LandownerEmail { get; set; } = null!;

    public string LandownerPhoneNumber { get; set; } = null!;

    public string LandownerAddress { get; set; } = null!;

    public string LandownerCity { get; set; } = null!;

    public string LandownerState { get; set; } = null!;

    public string LandownerZipCode { get; set; } = null!;
}
