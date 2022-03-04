using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class WaterAllocationAccessorTests : AccessorTestBase
    {
        [TestMethod]
        [TestCategory("Accessor Tests")]
        public void WaterAllocationAccessor_GetWaterAllocationAmountOrganizationById_ShouldReturnOrg()
        {
            // Arrange
            var site = new SitesDimFaker().Generate();
            using(var db = CreateDatabaseContextFactory().Create())
            {
                db.SitesDim.Add(site);
                db.SaveChanges();
            }

            var accessor = new WaterAllocationAccessor(CreateLogger<WaterAllocationAccessor>(), CreateDatabaseContextFactory());
            var expectedOrg = site.AllocationBridgeSitesFact.First().AllocationAmount.Organization;

            // Act
            var allocationAmountId = site.AllocationBridgeSitesFact.First().AllocationAmountId;
            var result = accessor.GetWaterAllocationAmountOrganizationById(allocationAmountId);
            

            // Assert
            result.Should().NotBeNull();
            result.OrganizationDataMappingUrl.Should().NotBeNullOrWhiteSpace();
            result.OrganizationDataMappingUrl.Should().Be(expectedOrg.OrganizationDataMappingUrl);
            result.OrganizationName.Should().Be(expectedOrg.OrganizationName);
            result.OrganizationId.Should().Be(expectedOrg.OrganizationId);
        }
    }
}
