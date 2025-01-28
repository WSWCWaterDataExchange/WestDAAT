namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationFaker : Faker<EFWD.WaterConservationApplication>
{
    public WaterConservationApplicationFaker(EFWD.User user = null, EFWD.Organization organization = null)
    {
        RuleFor(wca => wca.SubmittedDate, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));

        RuleFor(wca => wca.CompensationRateDollars, f => f.Random.Int(100, 1000));

        RuleFor(wca => wca.CompensationRateUnits, f => f.PickRandomWithout(Common.DataContracts.CompensationRateUnits.None));

        RuleFor(wca => wca.ApplicationDisplayId, f => f.Random.String2(10));

        RuleFor(wca => wca.WaterRightNativeId, f => f.Random.String(11, 'A', 'z'));

        if (user != null)
        {
            RuleFor(wca => wca.ApplicantUser, () => user);
        }

        if (organization != null)
        {
            RuleFor(wca => wca.FundingOrganization, () => organization);
        }
    }
}
