namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationReviewNote
{
    public Guid Id { get; set; }

    public DateTimeOffset SubmittedDate { get; set; }

    public string SubmittedByFullName { get; set; } = null!;

    public string Text { get; set; } = null!;
}
