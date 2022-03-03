using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    internal class AllocationAmountFactFaker : Faker<AllocationAmountsFact>
    {
        public AllocationAmountFactFaker()
        {
            this.RuleFor(a => a.Organization, b => new OrganizationsDimFaker().Generate());
        }
    }
}