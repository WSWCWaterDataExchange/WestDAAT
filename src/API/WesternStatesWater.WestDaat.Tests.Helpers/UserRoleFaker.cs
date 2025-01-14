namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserRoleFaker : Faker<EF.UserRole>
{
    public UserRoleFaker()
    {
        RuleFor(ur => ur.Role, f => f.Name.JobTitle()
    }
}
