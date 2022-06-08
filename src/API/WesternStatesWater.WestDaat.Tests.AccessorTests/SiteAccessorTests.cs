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

        [TestMethod]
        public async Task SiteAccessor_GetWaterSiteLocationByUuid()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            db.SitesDim.Add(site);
            db.SaveChanges();

            var expectedResult = new Common.DataContracts.SiteLocation
            {
                Geometry = site.Geometry,
                Latitude = site.Latitude,
                Longitude = site.Longitude,
                PODorPOUSite = site.PODorPOUSite,
                SiteUuid = site.SiteUuid,
            };

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterSiteLocationByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public async Task SiteAccessor_GetWaterSiteSourceInfoById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            db.SitesDim.Add(site);
            db.SaveChanges();

            var waterSources = new WaterSourceDimFaker().Generate(5);
            db.WaterSourcesDim.AddRange(waterSources);
            db.SaveChanges();

            foreach (var waterSource in waterSources)
            {
                var waterSourceBridge = new WaterSourceBridgeSiteFactFaker()
                    .WaterSourceBridgeSiteFactFakerWithIds(waterSource.WaterSourceId, site.SiteId)
                    .Generate();
                db.WaterSourceBridgeSitesFact.Add(waterSourceBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterSiteSourceInfoListByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.WaterSourceUuid == waterSources[0].WaterSourceUuid).Should().BeTrue();
        }

        [TestMethod]
        public async Task GetSiteDetailsByUuid_Matches()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            db.SitesDim.Add(site);
            db.SaveChanges();

            var expectedResult = new Common.DataContracts.SiteDetails
            {
                SiteUuid = site.SiteUuid,
                County = site.County,
                Latitude = site.Latitude,
                Longitude = site.Longitude,
                PodOrPou = site.PODorPOUSite,
                SiteName = site.SiteName,
                SiteNativeId = site.SiteNativeId,
                SiteType = site.SiteTypeCv,
            };

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDetailsByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public async Task GetSiteDetailsByUuid_NoMatch()
        {
            // Act
            var accessor = CreateSiteAccessor();
            Func<Task> call = async () => await accessor.GetSiteDetailsByUuid("test");

            // Assert
            await call.Should().ThrowAsync<Exception>();
        }

        private ISiteAccessor CreateSiteAccessor()
        {
            return new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
