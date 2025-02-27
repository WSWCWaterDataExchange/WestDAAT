namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionPropertyInfo
{
    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public string ProjectLocation { get; set; } = null!;

    public string PropertyAdditionalDetails { get; set; } = null!;

    // question: mockups show the help text "Address / Coordinates?". Does it make sense to have this be a single string field?
    public string DiversionPoint { get; set; } = null!;

    public string DiversionPointDetails { get; set; } = null!;
}
