using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    [TestCategory("Accessor Tests")]
    public class SiteAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task SiteAccessor_GetSiteByUuid_ShouldReturnSite()
        {
            // Arrange
            var siteDims = new SitesDimFaker()
                .LinkAllocationAmounts(new AllocationAmountFactFaker().Generate(5).ToArray())
                .Generate(10);
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.SitesDim.AddRange(siteDims);
                db.SaveChanges();
                db.AllocationBridgeSitesFact.Should().HaveCount(50);
            }


            // Act
            var searchSite = siteDims.First();
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteByUuid(searchSite.SiteUuid);


            // Assert
            result.Should().NotBeNull();
            result.County.Should().Be(searchSite.County);
            result.Latitude.Should().Be(searchSite.Latitude);
            result.Longitude.Should().Be(searchSite.Longitude);
            result.AllocationIds.Should().HaveCount(5);
            result.AllocationIds.First().Should().Be(searchSite.AllocationBridgeSitesFact.First().AllocationBridgeId);
        }

        [TestMethod]
        [DataRow(null, null, null)]
        [DataRow("POINT (10 20)", null, "POINT (10 20)")]
        [DataRow(null, "POINT (20 30)", "POINT (20 30)")]
        [DataRow("POINT (10 20)", "POINT (20 30)", "POINT (10 20)")]
        public async Task SiteAccessor_GetSiteByUuid_Geography(string geometry, string sitePoint, string expectedGeography)
        {
            var siteDim = new SitesDimFaker()
                .RuleFor(a => a.Geometry, b => GeometryHelpers.GetGeometry(geometry))
                .RuleFor(a => a.SitePoint, b => GeometryHelpers.GetGeometry(sitePoint))
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.SitesDim.Add(siteDim);
                db.SaveChanges();
            }

            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteByUuid(siteDim.SiteUuid);

            result.Should().NotBeNull();
            result.Geometry?.AsText().Should().Be(expectedGeography);
        }

        private ISiteAccessor CreateSiteAccessor()
        {
            return new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
