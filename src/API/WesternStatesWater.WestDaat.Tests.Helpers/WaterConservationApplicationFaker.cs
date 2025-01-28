namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class WaterConservationApplicationFaker : Faker<EFWD.WaterConservationApplication>
{
    public WaterConservationApplicationFaker(EFWD.User user = null, EFWD.Organization organization = null)
    {
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
