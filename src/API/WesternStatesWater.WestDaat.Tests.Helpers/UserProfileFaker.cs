namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserProfileFaker : Faker<EFWD.UserProfile>
{
    public UserProfileFaker()
    {
        RuleFor(up => up.FirstName, f => f.Person.FirstName);
        RuleFor(up => up.LastName, f => f.Person.LastName);
        RuleFor(up => up.UserName, f => f.Person.UserName);
        RuleFor(up => up.State, f => f.Address.StateAbbr());
        RuleFor(up => up.Country, f => f.Address.Country());
        RuleFor(up => up.PhoneNumber, f => f.Person.Phone);
    }
}