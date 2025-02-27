namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionCanalAndIrrigationInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string EntityName { get; set; } = null!;

    public string EntityEmail { get; set; } = null!;

    public string EntityPhoneNumber { get; set; } = null!;
}
