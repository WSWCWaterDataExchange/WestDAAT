using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class WaterSourceBridgeSiteFactFaker : Faker<WaterSourceBridgeSitesFact>
    {
        public WaterSourceBridgeSiteFactFaker()
        {
        }

        public Faker<WaterSourceBridgeSitesFact> WaterSourceBridgeSiteFactFakerWithIds(long waterSourceId, long siteId)
        {
            return new WaterSourceBridgeSiteFactFaker()
                .RuleFor(a => a.Site, b => null)
                .RuleFor(a => a.SiteId, b => siteId)
                .RuleFor(a => a.WaterSource, b => null)
                .RuleFor(a => a.WaterSourceId, b => waterSourceId);
        }
    }
}
