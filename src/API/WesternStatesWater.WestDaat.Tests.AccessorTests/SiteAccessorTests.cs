using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SiteAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void SiteAccessor_GetSiteByUuid_ShouldReturnSite()
        {
            // Arrange
            var siteDims = new SitesDimFaker().Generate(10);
            using(var db = CreateDatabaseContextFactory().Create())
            {
                db.SitesDim.AddRange(siteDims);
                db.SaveChanges();
            }

            var accessor = new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());

            // Act
            var searchSite = siteDims.First();
            var result = accessor.GetSiteByUuid(searchSite.SiteUuid);
            

            // Assert
            result.Should().NotBeNull();
            result.County.Should().Be(searchSite.County);
            result.Latitude.Should().Be(searchSite.Latitude);
            result.Longitude.Should().Be(searchSite.Longitude);
            result.AllocationIds.Should().HaveCountGreaterThan(0);
            result.AllocationIds.First().Should().Be(searchSite.AllocationBridgeSitesFact.First().AllocationBridgeId);
        }
    }
}
