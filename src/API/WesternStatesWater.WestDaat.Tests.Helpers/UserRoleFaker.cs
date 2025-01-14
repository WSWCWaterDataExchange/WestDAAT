namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserRoleFaker : Faker<EF.UserRole>
{
    public UserRoleFaker(EF.User user = null)
    {
        RuleFor(ur => ur.Role, f => f.Name.JobTitle());

        if (user != null)
        {
            RuleFor(ur => ur.User, () => user);
        }
    }
}
