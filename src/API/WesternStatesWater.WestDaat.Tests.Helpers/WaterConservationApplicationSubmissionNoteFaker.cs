namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationSubmissionNoteFaker : Faker<EFWD.WaterConservationApplicationSubmissionNote>
{
    public WaterConservationApplicationSubmissionNoteFaker(EFWD.WaterConservationApplicationSubmission submission = null, EFWD.User user = null)
    {
        RuleFor(note => note.Timestamp, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));

        RuleFor(note => note.Note, f => f.Lorem.Paragraph());

        if (submission != null)
        {
            RuleFor(note => note.WaterConservationApplicationSubmission, () => submission);
        }

        if (user != null)
        {
            RuleFor(note => note.User, () => user);
        }
    }
}
