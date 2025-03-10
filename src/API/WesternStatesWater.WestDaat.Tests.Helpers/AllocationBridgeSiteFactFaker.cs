using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class AllocationBridgeSiteFactFaker : Faker<AllocationBridgeSitesFact>
    {
        public AllocationBridgeSiteFactFaker()
        {
            this.RuleFor(a => a.AllocationAmount, b => new AllocationAmountFactFaker().Generate());
        }

        public Faker<AllocationBridgeSitesFact> AllocationBridgeSiteFactFakerWithIds(long allocationId, long siteId)
        {
            return new AllocationBridgeSiteFactFaker()
                .RuleFor(a => a.AllocationAmount, b => null)
                .RuleFor(a => a.AllocationAmountId, b => allocationId)
                .RuleFor(a => a.Site, b => null)
                .RuleFor(a => a.SiteId, b => siteId);
        }
    }
}