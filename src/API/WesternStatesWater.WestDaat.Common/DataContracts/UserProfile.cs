namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class UserProfile
{
    public Guid UserId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string UserName { get; set; }

    public string State { get; set; }

    public string Country { get; set; }

    public string PhoneNumber { get; set; }
    
    public string AffiliatedOrganization { get; set; }
    
    public bool IsSignupComplete { get; set; }

    public OrganizationMembership[] OrganizationMemberships { get; set; }
}