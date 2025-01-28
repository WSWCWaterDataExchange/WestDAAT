namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationSubmissionFaker : Faker<EFWD.WaterConservationApplicationSubmission>
{
    public WaterConservationApplicationSubmissionFaker(EFWD.WaterConservationApplication application = null)
    {
        RuleFor(wcas => wcas.SubmittedDate, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));

        RuleFor(wcas => wcas.CompensationRateDollars, f => f.Random.Int(100, 1000));

        RuleFor(wcas => wcas.CompensationRateUnits, f => f.PickRandomWithout(Common.DataContracts.CompensationRateUnits.None));

        RuleFor(wcas => wcas.ApplicationDisplayId, f => f.Random.String2(10));

        RuleFor(wcas => wcas.WaterRightNativeId, f => f.Random.String(11, 'A', 'z'));

        if (application != null)
        {
            RuleFor(wcas => wcas.WaterConservationApplication, () => application);
        }
    }
}
