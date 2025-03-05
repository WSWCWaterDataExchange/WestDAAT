namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserProfileUpdateRequest : UserStoreRequestBase
{
    public Guid UserId { get; set; }
    
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;
    
    public string AffiliatedOrganization { get; set; } = null!;
}