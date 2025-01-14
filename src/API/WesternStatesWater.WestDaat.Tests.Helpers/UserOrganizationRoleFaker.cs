namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserOrganizationRoleFaker : Faker<EF.UserOrganizationRole>
{
    public UserOrganizationRoleFaker()
    {
        RuleFor(uor => uor.Role, f => f.Name.JobTitle());
    }
}
