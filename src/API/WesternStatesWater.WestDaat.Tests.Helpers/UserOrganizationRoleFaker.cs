using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserOrganizationRoleFaker : Faker<EFWD.UserOrganizationRole>
{
    public UserOrganizationRoleFaker(EFWD.UserOrganization userOrganization = null)
    {
        RuleFor(uor => uor.Role, _ => Roles.Member);

        if (userOrganization != null)
        {
            RuleFor(uor => uor.UserOrganization, () => userOrganization);
        }
    }
}
