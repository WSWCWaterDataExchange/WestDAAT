namespace WesternStatesWater.WestDaat.Tests.Helpers;

public class OrganizationFaker : Faker<EF.Organization>
{
    public OrganizationFaker()
    {
        RuleFor(o => o.Name, f => f.Company.CompanyName());
    }
}
