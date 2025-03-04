namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class UserProfileUpdateRequest : UserStoreRequestBase
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;
}