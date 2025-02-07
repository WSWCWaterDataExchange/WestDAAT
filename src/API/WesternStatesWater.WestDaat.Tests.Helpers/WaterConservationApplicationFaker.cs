namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationFaker : Faker<EFWD.WaterConservationApplication>
{
    public WaterConservationApplicationFaker(EFWD.User user = null, EFWD.Organization organization = null)
    {
        RuleFor(wcas => wcas.WaterRightNativeId, f => f.Random.String(11, 'A', 'z'));
        
        RuleFor(wcas => wcas.WaterRightState, f => f.Address.StateAbbr());

        RuleFor(wcas => wcas.ApplicationDisplayId, f => f.Random.String2(10));

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
