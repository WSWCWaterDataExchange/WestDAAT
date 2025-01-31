namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserProfileFaker : Faker<EFWD.UserProfile>
{
    public UserProfileFaker(EFWD.User user = null)
    {
        RuleFor(up => up.FirstName, f => f.Person.FirstName);
        RuleFor(up => up.LastName, f => f.Person.LastName);
        
        if (user != null)
        {
            RuleFor(up => up.User, () => user);
        }
    }
}