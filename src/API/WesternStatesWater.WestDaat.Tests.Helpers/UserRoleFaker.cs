namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserRoleFaker : Faker<EFWD.UserRole>
{
    public UserRoleFaker(EFWD.User user = null)
    {
        RuleFor(ur => ur.Role, f => f.Name.JobTitle());

        if (user != null)
        {
            RuleFor(ur => ur.User, () => user);
        }
    }
}
