namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class UserFaker : Faker<EF.User>
{
    public UserFaker()
    {
        RuleFor(u => u.Email, f => f.Person.Email)
            .RuleFor(u => u.CreatedAt, f => f.Date.PastOffset(1, DateTimeOffset.UtcNow));
    }
}
