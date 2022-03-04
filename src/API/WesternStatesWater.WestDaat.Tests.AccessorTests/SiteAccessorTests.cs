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
        public void SiteAccessor_GetSiteByUuid_ShouldReturnSite()
        {
            // Arrange
            var siteDims = new SitesDimFaker().Generate(10);
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.SitesDim.AddRange(siteDims);
                db.SaveChanges();
            }


            // Act
            var searchSite = siteDims.First();
            var accessor = CreateSiteAccessor();
            var result = accessor.GetSiteByUuid(searchSite.SiteUuid);


            // Assert
            result.Should().NotBeNull();
            result.County.Should().Be(searchSite.County);
            result.Latitude.Should().Be(searchSite.Latitude);
            result.Longitude.Should().Be(searchSite.Longitude);
            result.AllocationIds.Should().HaveCountGreaterThan(0);
            result.AllocationIds.First().Should().Be(searchSite.AllocationBridgeSitesFact.First().AllocationBridgeId);
        }

        private ISiteAccessor CreateSiteAccessor()
        {
            return new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
