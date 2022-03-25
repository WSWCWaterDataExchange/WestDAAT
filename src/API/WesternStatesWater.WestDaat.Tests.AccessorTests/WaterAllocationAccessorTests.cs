using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;
using EF = WesternStatesWater.WestDaat.Accessors.EntityFramework;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

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
            var allocationAmount = new AllocationAmountFactFaker().Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.AllocationAmountsFact.Add(allocationAmount);
                db.SaveChanges();
            }

            var expectedOrg = allocationAmount.Organization;
            var allocationAmountId = allocationAmount.AllocationAmountId;

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = accessor.GetWaterAllocationAmountOrganizationById(allocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.OrganizationDataMappingUrl.Should().NotBeNullOrWhiteSpace();
            result.OrganizationDataMappingUrl.Should().Be(expectedOrg.OrganizationDataMappingUrl);
            result.OrganizationName.Should().Be(expectedOrg.OrganizationName);
            result.OrganizationId.Should().Be(expectedOrg.OrganizationId);
        }

        [TestMethod]
        [TestCategory("Accessor Tests")]
        public async Task WaterAllocationAccessor_GetWaterRightDetailsById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var expectedOrg = allocationAmount.Organization;
            var expectedVariable = allocationAmount.VariableSpecific;
            var allocationAmountId = allocationAmount.AllocationAmountId;

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightDetailsById(allocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.AllocationOwner.Should().Be(allocationAmount.AllocationOwner);
            result.OrganizationName.Should().Be(expectedOrg.OrganizationName);
            result.AggregationInterval.Should().Be(expectedVariable.AggregationInterval);
        }

        [TestMethod]
        [TestCategory("Accessor Tests")]
        public async Task WaterAllocationAccessor_GetWaterRightSiteInfoById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteInfoById(allocationAmount.AllocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.SiteUuid == sites[0].SiteUuid).Should().BeTrue();
        }

        [TestMethod]
        [TestCategory("Accessor Tests")]
        public async Task WaterAllocationAccessor_GetWaterRightSourceInfoById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var waterSources = new WaterSourceDimFaker().Generate(5);
            db.WaterSourcesDim.AddRange(waterSources);
            db.SaveChanges();


            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.AllocationBridgeSitesFact.Add(allocationSiteBridge);

                foreach (var waterSource in waterSources)
                {
                    var waterSourceBridge = new WaterSourceBridgeSiteFactFaker()
                        .WaterSourceBridgeSiteFactFakerWithIds(waterSource.WaterSourceId, site.SiteId)
                        .Generate();
                    db.WaterSourceBridgeSitesFact.Add(waterSourceBridge);
                }
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSourceInfoById(allocationAmount.AllocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(5);
            result.Any(x => x.WaterSourceUuid == waterSources[0].WaterSourceUuid).Should().BeTrue();
        }

        [TestCategory("Accessor Tests")]
        [DataTestMethod]
        [DataRow(null)]
        [DataRow("2022-01-22")]
        public async Task GetAllWaterAllocations_PriorityDate(string dateValue)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            DateTime? date = dateValue == null ? null : DateTime.Parse(dateValue);

            var allocationAmount = new AllocationAmountFactFaker()
                .SetAllocationPriorityDate(date)
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetAllWaterAllocations();

            // Assert
            result.Should().NotBeNull().And
                .HaveCount(1).And
                .Contain(a => a.AllocationPriorityDate == date);
        }

        [TestCategory("Accessor Tests")]
        [TestMethod]
        public async Task GetWaterRightsDigestsBySite_Matches()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var date = new Faker().Date.Past(150);
            var site = new SitesDimFaker().Generate();

            var allocationAmount = new AllocationAmountFactFaker()
                .SetAllocationPriorityDate(date)
                .RuleFor(a => a.AllocationNativeId, f => f.Random.String(11, 'A', 'z'))
                .LinkSites(site)
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightsDigestsBySite(site.SiteUuid);

            // Assert
            result.Should().NotBeNull().And
                .BeEquivalentTo(new[]
                {
                    new CommonContracts.WaterRightsDigest
                    {
                        Id = allocationAmount.AllocationAmountId,
                        NativeId = allocationAmount.AllocationNativeId,
                        PriorityDate = date.Date,
                        BeneficialUses = new List<string>()
                    }
                });
        }

        [TestCategory("Accessor Tests")]
        [DataTestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task GetWaterRightsDigestsBySite_Multiples(int allocationCount)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var site = new SitesDimFaker().Generate();
            db.SitesDim.Add(site);

            var allocationAmount = new AllocationAmountFactFaker()
                .LinkSites(site)
                .Generate(allocationCount);
            db.AllocationAmountsFact.AddRange(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightsDigestsBySite(site.SiteUuid);

            // Assert
            var dbSites = db.SitesDim.ToList();
            dbSites.Should().HaveCount(1).And
                .AllSatisfy(a => a.SiteUuid.Should().Be(site.SiteUuid));
            result.Select(a => a.Id).Should()
                .BeEquivalentTo(allocationAmount.Select(a => a.AllocationAmountId));
        }

        [TestCategory("Accessor Tests")]
        [DataTestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task GetWaterRightsDigestsBySite_BeneficialUses(int beneficialUseCount)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var site = new SitesDimFaker().Generate();
            var beneficialUses = new BeneficialUsesCVFaker().Generate(beneficialUseCount);

            var allocationAmount = new AllocationAmountFactFaker()
                .LinkSites(site)
                .LinkBeneficialUses(beneficialUses.ToArray())
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightsDigestsBySite(site.SiteUuid);

            // Assert
            result
                .Should().NotBeNull().And
                .HaveCount(1);

            result[0].BeneficialUses
                .Should().NotBeNull().And
                .BeEquivalentTo(beneficialUses.Select(a => a.Name));
        }

        [TestCategory("Accessor Tests")]
        [DataTestMethod]
        [DataRow(null)]
        [DataRow("2022-01-22")]
        public async Task GetWaterRightsDigestsBySite_Dates(string dateValue)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var site = new SitesDimFaker().Generate();

            DateTime? date = dateValue == null ? null : DateTime.Parse(dateValue);

            var allocationAmount = new AllocationAmountFactFaker()
                .LinkSites(site)
                .SetAllocationPriorityDate(date)
                .Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightsDigestsBySite(site.SiteUuid);

            // Assert
            result
                .Should().NotBeNull().And
                .HaveCount(1);

            result[0].PriorityDate.Should().Be(date);
        }

        [TestMethod]
        [TestCategory("Accessor Tests")]
        public async Task WaterAllocationAccessor_GetWaterRightSiteLocationsById()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteLocationsById(allocationAmount.AllocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.Count().Should().Be(5);
            result.Any(x => x.Latitude == sites[0].Latitude).Should().BeTrue();
        }

        [TestMethod]
        [TestCategory("Accessor Tests")]
        public async Task WaterAllocationAccessor_GetWaterRightSiteLocationsById_SkipNulls()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            var allocationAmount = new AllocationAmountFactFaker().Generate();
            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            var nullLocationSite = new SitesDimFaker().Generate();
            nullLocationSite.Latitude = null;
            nullLocationSite.Longitude = null;
            db.SitesDim.Add(nullLocationSite);
            db.SaveChanges();

            sites.Add(nullLocationSite);

            foreach (var site in sites)
            {
                var allocationSiteBridge = new AllocationBridgeSiteFactFaker()
                    .AllocationBridgeSiteFactFakerWithIds(allocationAmount.AllocationAmountId, site.SiteId)
                    .Generate();
                db.Add(allocationSiteBridge);
            }
            db.SaveChanges();

            // Act
            var accessor = CreateWaterAllocationAccessor();
            var result = await accessor.GetWaterRightSiteLocationsById(allocationAmount.AllocationAmountId);

            // Assert
            result.Should().NotBeNull();
            result.Count().Should().Be(5);
        }

        private IWaterAllocationAccessor CreateWaterAllocationAccessor()
        {
            return new WaterAllocationAccessor(CreateLogger<WaterAllocationAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
