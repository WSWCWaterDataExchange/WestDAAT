namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserOrganizationRoleFaker : Faker<EF.UserOrganizationRole>
{
    public UserOrganizationRoleFaker(EF.UserOrganization userOrganization = null)
    {
        RuleFor(uor => uor.Role, f => f.Name.JobTitle());

        if (userOrganization != null)
        {
            RuleFor(uor => uor.UserOrganization, () => userOrganization);
        }
    }
}
