namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserProfileFaker : Faker<EFWD.UserProfile>
{
    public UserProfileFaker()
    {
        RuleFor(up => up.FirstName, f => f.Person.FirstName);
        RuleFor(up => up.LastName, f => f.Person.LastName);
    }
}