using System;
using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class SitesDimFaker : Faker<SitesDim>
    {
        public SitesDimFaker()
        {
            this.RuleFor(a => a.Latitude, b => b.Random.Double(-90, 90))
            .RuleFor(a => a.Longitude, b => b.Random.Double(-180, 180))
            .RuleFor(a => a.AllocationBridgeSitesFact, b => new AllocationBridgeSiteFactFaker().Generate(5));

            // Todo RuleFor rest of the properties...
        }

        public void CreateSpecialSite(string country)
        {
            this.RuleFor(a => a.County, country);
        }
    }
}
