using System;
using Bogus;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class SitesDimFaker : Faker<SitesDim>
    {
        public SitesDimFaker()
        {
            var coordinateMethod = new CoordinateMethodFaker().Generate();

            this.RuleFor(a => a.SiteUuid, b => b.Random.String(11))
                .RuleFor(a => a.Latitude, b => b.Random.Double(-90, 90))
                .RuleFor(a => a.Longitude, b => b.Random.Double(-180, 180))
                .RuleFor(a => a.SiteName, b => b.Address.StreetName())
                .RuleFor(a => a.CoordinateMethodCvNavigation, coordinateMethod)
                .RuleFor(a => a.CoordinateMethodCv, coordinateMethod.Name)
                .RuleFor(a => a.EpsgcodeCvNavigation, new EpsgcodeFaker().Generate())
                .RuleFor(a => a.AllocationBridgeSitesFact, b => new AllocationBridgeSiteFactFaker().Generate(5));
        }

        public void CreateSpecialSite(string country)
        {
            this.RuleFor(a => a.County, country);
        }
    }
}
