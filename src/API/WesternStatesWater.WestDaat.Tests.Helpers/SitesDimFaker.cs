using NetTopologySuite.Geometries;
using System.Diagnostics.CodeAnalysis;
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
                .RuleFor(a => a.HUC8, b => b.Random.String(4, 'A', 'z'))
                .RuleFor(a => a.HUC12, b => b.Random.String(4, 'A', 'z'))
                .RuleFor(a => a.County, b => b.Address.County())
                .RuleFor(a => a.SiteTypeCvNavigation, b => new SiteTypeFaker().Generate())
                .RuleFor(a => a.GniscodeCvNavigation, b => new GnisfeatureNameFaker().Generate())
                .RuleFor(a => a.PODorPOUSite, b => b.Random.String(3, 'A', 'z'))
                .RuleFor(a => a.SiteNativeId, b => b.Random.String(5, 'A', 'z'))
                .RuleFor(a => a.Geometry, b => new NetTopologySuite.Geometries.Point(new Coordinate(b.Random.Double(-180, 180), b.Random.Double(-90, 90))));
        }
    }

    [SuppressMessage("StyleCop.CSharp.OrderingRules", "SA1204:StaticElementsMustAppearBeforeInstanceElements", Justification = "Extension methods after class.")]
    public static class SitesDimFakerExtensions
    {
        public static Faker<SitesDim> LinkAllocationAmounts(this Faker<SitesDim> faker, params AllocationAmountsFact[] allocationAmounts)
        {
            faker.RuleFor(a => a.AllocationBridgeSitesFact, () => allocationAmounts.Select(c => new AllocationBridgeSiteFactFaker().RuleFor(a => a.AllocationAmount, () => c).Generate()).ToList());
            return faker;
        }

        public static Faker<SitesDim> CreateSpecialSite(this Faker<SitesDim> faker, string country)
        {
            faker.RuleFor(a => a.County, country);
            return faker;
        }
    }
}
