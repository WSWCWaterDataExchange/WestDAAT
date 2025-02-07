namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationSubmissionFaker : Faker<EFWD.WaterConservationApplicationSubmission>
{
    public WaterConservationApplicationSubmissionFaker(EFWD.WaterConservationApplication application = null)
    {
        RuleFor(wcas => wcas.SubmittedDate, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));

        RuleFor(wcas => wcas.CompensationRateDollars, f => f.Random.Int(100, 1000));

        RuleFor(wcas => wcas.CompensationRateUnits, f => f.PickRandomWithout(Common.DataContracts.CompensationRateUnits.None));

        RuleFor(wcas => wcas.WaterRightState, f => f.Address.StateAbbr());
        
        if (application != null)
        {
            RuleFor(wcas => wcas.WaterConservationApplication, () => application);
        }
    }
}
