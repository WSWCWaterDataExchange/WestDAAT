namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationSubmissionFaker : Faker<EFWD.WaterConservationApplicationSubmission>
{
    public WaterConservationApplicationSubmissionFaker(EFWD.WaterConservationApplication application = null)
    {
        RuleFor(wcas => wcas.SubmittedDate, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));

        if (application != null)
        {
            RuleFor(wcas => wcas.WaterConservationApplication, () => application);
        }
    }
}
