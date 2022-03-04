using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class OrganizationsDimFaker : Faker<OrganizationsDim>
    {
        public OrganizationsDimFaker()
        {
            this.RuleFor(a => a.OrganizationDataMappingUrl, b => b.Internet.Url())
                .RuleFor(a => a.OrganizationUuid, b => b.Random.AlphaNumeric(7))
                .RuleFor(a => a.OrganizationName, b => b.Company.CompanyName())
                .RuleFor(a => a.OrganizationPhoneNumber, b => b.Phone.PhoneNumber())
                .RuleFor(a => a.OrganizationWebsite, b => b.Internet.Url())
                .RuleFor(a => a.OrganizationContactName, b => b.Person.FullName)
                .RuleFor(a => a.OrganizationContactEmail, b => b.Person.Email)
                .RuleFor(a => a.State, b => b.Address.StateAbbr());
        }
    }
}