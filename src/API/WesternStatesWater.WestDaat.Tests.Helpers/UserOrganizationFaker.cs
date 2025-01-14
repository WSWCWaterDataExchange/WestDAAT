namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserOrganizationFaker : Faker<EF.UserOrganization>
{
    public UserOrganizationFaker(EF.User user = null, EF.Organization organization = null)
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
