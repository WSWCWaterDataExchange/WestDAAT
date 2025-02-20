namespace WesternStatesWater.WestDaat.Contracts.Client;

public class UserListResult
{
    public Guid UserId { get; set; }

    public string UserName { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Role { get; set; }
}