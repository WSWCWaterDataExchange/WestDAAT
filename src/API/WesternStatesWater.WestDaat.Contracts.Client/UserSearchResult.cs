namespace WesternStatesWater.WestDaat.Contracts.Client;

public class UserSearchResult
{
    public Guid UserId { get; init; }

    public string UserName { get; init; }

    public string FirstName { get; init; }

    public string LastName { get; init; }
    
    public string Email { get; init; }
}