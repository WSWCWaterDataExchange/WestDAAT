using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class OrganizationsDimFaker : Faker<OrganizationsDim>
    {
        public OrganizationsDimFaker()
        {
            this.RuleFor(a => a.OrganizationDataMappingUrl, b => b.Internet.Url());
        }
    }
}