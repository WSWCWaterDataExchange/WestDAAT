namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationSubmissionNote
{
    public WaterConservationApplicationSubmissionNote()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationSubmissionId { get; set; }

    public Guid UserId { get; set; }

    public DateTimeOffset Timestamp { get; set; }

    public string Text { get; set; } = null!;

    public virtual WaterConservationApplicationSubmission WaterConservationApplicationSubmission { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
