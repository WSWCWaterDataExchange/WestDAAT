namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class OrganizationFaker : Faker<EFWD.Organization>
{
    public OrganizationFaker()
    {
        RuleFor(o => o.Name, f => f.Company.CompanyName());
    }
}
