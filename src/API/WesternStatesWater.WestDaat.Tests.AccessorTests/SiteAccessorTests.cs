﻿using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
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
            var site = new SitesDimFaker()
                .RuleFor(a=>a.CoordinateAccuracy, f=> f.Random.AlphaNumeric(5))
                .Generate();
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
                CoordinateMethodCv = site.CoordinateMethodCv,
                CoordinateAccuracy = site.CoordinateAccuracy,
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

        [TestMethod]
        public async Task GetSiteDigestByUuid_Matches()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker()
                .RuleFor(a => a.CoordinateAccuracy, f => f.Random.AlphaNumeric(5))
                .Generate();
            db.SitesDim.Add(site);
            db.SaveChanges();

            var expectedResult = new Common.DataContracts.SiteDigest
            {
                SiteUuid = site.SiteUuid,
                SiteName = site.SiteName,
                SiteNativeId = site.SiteNativeId,
                SiteType = site.SiteTypeCv,
            };

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDigestByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResult);
        }

        [TestMethod]
        public async Task SiteAccessor_GetWaterRightInfoListByUuid_Matches()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            var allocationAmount = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationNativeId, f => f.Random.String(11, 'A', 'z'))
                .LinkSites(site)
                .Generate();

            db.AllocationAmountsFact.Add(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterRightInfoListByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(1);
            result.First().WaterRightNativeId.Should().Be(allocationAmount.AllocationNativeId);
            result.First().AllocationUuid.Should().Be(allocationAmount.AllocationUuid);
        }

        [DataTestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task SiteAccessor_GetWaterRightInfoListByUuid_Multiple(int waterRightCount)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            var allocationAmount = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationNativeId, f => f.Random.String(11, 'A', 'z'))
                .LinkSites(site)
                .Generate(waterRightCount);

            db.AllocationAmountsFact.AddRange(allocationAmount);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterRightInfoListByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.Count.Should().Be(waterRightCount);
        }

        [DataTestMethod]
        [DataRow(0)]
        [DataRow(1)]
        [DataRow(2)]
        public async Task GetWaterRightInfoList_BeneficialUses(int beneficialUseCount)
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
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterRightInfoListByUuid(site.SiteUuid);

            // Assert
            result
                .Should().NotBeNull().And
                .HaveCount(1);

            result[0].BeneficialUses
                .Should().NotBeNull().And
                .BeEquivalentTo(beneficialUses.Select(a => a.Name));
        }

        [DataTestMethod]
        [DataRow(null)]
        [DataRow("2022-01-22")]
        public async Task GetWaterRightInfoList_Dates(string dateValue)
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
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetWaterRightInfoListByUuid(site.SiteUuid);

            // Assert
            result
                .Should().NotBeNull().And
                .HaveCount(1);

            result[0].PriorityDate.Should().Be(date);
        }

        [TestMethod]
        public void SiteAccessor_GetAllJsonLDData()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var sites = new SitesDimFaker().Generate(5);
            db.SitesDim.AddRange(sites);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var enumerable = accessor.GetJSONLDData();
            // Assert
            var result = enumerable.ToList();

            sites.ForEach(site =>
            {
                var justOne = result.Where(res =>
                    res.Latitude == site.Latitude
                    && res.Longitude == site.Longitude
                    && res.SiteTypeCv == site.SiteTypeCv
                    && res.SiteUuid == site.SiteUuid
                    && res.SiteName == site.SiteName);

                justOne.Count().Should().Be(1);
            });
        }

        [DataTestMethod]
        [DataRow("", "name", "name")]
        [DataRow("wadeName", "name", "wadeName")]
        public async Task GetSites_UseWaterSourceTypeWaDEName(string wadeName, string name, string expectedName)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var waterSourceType = new WaterSourceTypeFaker()
                .RuleFor(a => a.Name, () => name)
                .RuleFor(a => a.WaDEName, () => wadeName);
            var waterSource = new WaterSourceDimFaker()
                .RuleFor(a => a.WaterSourceTypeCvNavigation, () => waterSourceType);

            var site = new SitesDimFaker();
            site.LinkWaterSources(waterSource);
            db.SitesDim.Add(site);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSites();

            result.Should().HaveCount(1);
            result[0].WaterSourceTypes.Should().HaveCount(1);
            result[0].WaterSourceTypes[0].Should().Be(expectedName);
        }

        [DataTestMethod]
        [DataRow("", "name1", "name1", "", "name2", "name2", "", "name3", "name3")]
        [DataRow("wadeName1", "name1", "wadeName1", "wadeName2", "name2", "wadeName2", "wadeName3", "name3", "wadeName3")]
        [DataRow("", "name1", "name1", "wadeName2", "name2", "wadeName2", "", "name3", "name3")]
        [DataRow("wadeName1", "name1", "wadeName1", "", "name2", "name2", "wadeName3", "name3", "wadeName3")]
        public async Task GetSites_UseWaterSourceTypeWaDEName_Multiple(string wadeName1, string name1, string expectedName1, string wadeName2, string name2, string expectedName2, string wadeName3, string name3, string expectedName3)
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var waterSourceType1 = new WaterSourceTypeFaker()
                .RuleFor(a => a.Name, () => name1)
                .RuleFor(a => a.WaDEName, () => wadeName1);
            var waterSource1 = new WaterSourceDimFaker()
                .RuleFor(a => a.WaterSourceTypeCvNavigation, () => waterSourceType1);

            var waterSourceType2 = new WaterSourceTypeFaker()
                .RuleFor(a => a.Name, () => name2)
                .RuleFor(a => a.WaDEName, () => wadeName2);
            var waterSource2 = new WaterSourceDimFaker()
                .RuleFor(a => a.WaterSourceTypeCvNavigation, () => waterSourceType2);

            var waterSourceType3 = new WaterSourceTypeFaker()
                .RuleFor(a => a.Name, () => name3)
                .RuleFor(a => a.WaDEName, () => wadeName3);
            var waterSource3 = new WaterSourceDimFaker()
                .RuleFor(a => a.WaterSourceTypeCvNavigation, () => waterSourceType3);

            var site = new SitesDimFaker();
            site.LinkWaterSources(waterSource1, waterSource2, waterSource3);
            db.SitesDim.Add(site);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSites();

            result.Should().HaveCount(1);
            result[0].WaterSourceTypes.Should().BeEquivalentTo(new[] { expectedName1, expectedName2, expectedName3 } );
        }

        private ISiteAccessor CreateSiteAccessor()
        {
            return new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
