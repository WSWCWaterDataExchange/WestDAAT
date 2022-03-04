using System;
using Bogus;
using NetTopologySuite.Geometries;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.Helpers
{
    public class SitesDimFaker : Faker<SitesDim>
    {
        public SitesDimFaker()
        {
            this.RuleFor(a => a.SiteUuid, b => b.Random.String(11, 'A', 'z'))
                .RuleFor(a => a.Latitude, b => b.Random.Double(-90, 90))
                .RuleFor(a => a.Longitude, b => b.Random.Double(-180, 180))
                .RuleFor(a => a.SiteName, b => b.Address.StreetName())
                .RuleFor(a => a.CoordinateMethodCvNavigation, new CoordinateMethodFaker().Generate())
                .RuleFor(a => a.EpsgcodeCvNavigation, new EpsgcodeFaker().Generate())
                .RuleFor(a => a.AllocationBridgeSitesFact, b => new AllocationBridgeSiteFactFaker().Generate(5))
                .RuleFor(a => a.HUC8, b => b.Random.String(4, 'A', 'z'))
                .RuleFor(a => a.HUC12, b => b.Random.String(4, 'A', 'z'))
                .RuleFor(a => a.County, b => b.Address.County())
                .RuleFor(a => a.SiteTypeCvNavigation, b => new SiteTypeFaker().Generate())
                .RuleFor(a => a.GniscodeCvNavigation, b => new GnisfeatureNameFaker().Generate())
                .RuleFor(a => a.Geometry, b => new NetTopologySuite.Geometries.Point(new Coordinate(b.Random.Double(-180, 180), b.Random.Double(-90, 90))));
        }

        public void CreateSpecialSite(string country)
        {
            this.RuleFor(a => a.County, country);
        }
    }
}
