using Bogus.Extensions;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserProfileFaker : Faker<EFWD.UserProfile>
{
    public UserProfileFaker()
    {
        RuleFor(up => up.FirstName, f => f.Person.FirstName.ClampLength(min: 3));
        RuleFor(up => up.LastName, f => f.Person.LastName.ClampLength(min: 3));
        RuleFor(up => up.UserName, f => f.Person.UserName.ClampLength(min: 3));
        RuleFor(up => up.State, f => f.Address.StateAbbr());
        RuleFor(up => up.Country, f => f.Address.Country().ClampLength(max: 50)); // Avoid sql column truncation
        RuleFor(up => up.PhoneNumber, f => f.Person.Phone);
    }
}