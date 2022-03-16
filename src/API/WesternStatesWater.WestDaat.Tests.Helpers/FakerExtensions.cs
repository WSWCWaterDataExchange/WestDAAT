using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public static class FakerExtensions
    {
        public static Faker<AllocationBridgeSitesFact> AllocationBridgeSiteFactFakerWithIds(this IRuleSet<AllocationBridgeSitesFact> faker, long allocationId, long siteId)
        {
            return faker
                .RuleFor(a => a.AllocationAmount, b => null)
                .RuleFor(a => a.AllocationAmountId, b => allocationId)
                .RuleFor(a => a.SiteId, b => siteId);
        }
        public static Faker<WaterSourceBridgeSitesFact> WaterSourceBridgeSiteFactFakerWithIds(this IRuleSet<WaterSourceBridgeSitesFact> faker, long waterSourceId, long siteId)
        {
            return faker
                .RuleFor(a => a.SiteId, b => siteId)
                .RuleFor(a => a.WaterSourceId, b => waterSourceId);
        }
    }
}
