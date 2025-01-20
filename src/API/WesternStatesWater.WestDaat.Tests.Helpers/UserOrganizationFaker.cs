namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserOrganizationFaker : Faker<EFWD.UserOrganization>
{
    public UserOrganizationFaker(EFWD.User user = null, EFWD.Organization organization = null)
    {
        if (user != null)
        {
            RuleFor(uo => uo.User, () => user);
        }

        if (organization != null)
        {
            RuleFor(uo => uo.Organization, () => organization);
        }
    }
}
