using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class AllocationBridgeSiteFactFaker : Faker<AllocationBridgeSitesFact>
    {
        public AllocationBridgeSiteFactFaker()
        {
            this.RuleFor(a => a.AllocationAmount, b => new AllocationAmountFactFaker().Generate());
        }
    }
}