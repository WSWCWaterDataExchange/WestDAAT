using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
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
        public async Task GetSiteDigestByUuid_ShouldReturnSiteWithWaterRights()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker()
                .RuleFor(a => a.CoordinateAccuracy, f => f.Random.AlphaNumeric(5))
                .Generate();

            var allocations = new AllocationAmountFactFaker()
                .RuleFor(a => a.AllocationNativeId, f => f.Random.String(10, 'A', 'z'))
                .RuleFor(a => a.AllocationUuid, f => Guid.NewGuid().ToString())
                .LinkSites(site)
                .Generate(3);

            db.SitesDim.Add(site);
            db.AllocationAmountsFact.AddRange(allocations);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDigestByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.SiteUuid.Should().Be(site.SiteUuid);
            result.SiteName.Should().Be(site.SiteName);
            result.SiteNativeId.Should().Be(site.SiteNativeId);
            result.SiteType.Should().Be(site.SiteTypeCv);
            result.WaterRightsDigests.Should().HaveCount(3);
            result.WaterRightsDigests.Select(w => w.NativeId).Should().BeEquivalentTo(allocations.Select(a => a.AllocationNativeId));
        }

        [TestMethod]
        public async Task GetSiteDigestByUuid_ShouldReturnSiteWithoutWaterRights()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            
            db.SitesDim.Add(site);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDigestByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.SiteUuid.Should().Be(site.SiteUuid);
            result.WaterRightsDigests.Should().BeEmpty();
        }

        [TestMethod]
        public async Task GetSiteDigestByUuid_WithBeneficialUses()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            
            var beneficialUses = new BeneficialUsesCVFaker().Generate(2);
            var allocation = new AllocationAmountFactFaker()
                .LinkSites(site)
                .LinkBeneficialUses(beneficialUses.ToArray())
                .Generate();

            db.SitesDim.Add(site);
            db.AllocationAmountsFact.Add(allocation);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDigestByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.WaterRightsDigests.Should().HaveCount(1);
            result.WaterRightsDigests[0].BeneficialUses.Should().BeEquivalentTo(beneficialUses.Select(a => a.Name));
        }

        [TestMethod]
        public async Task GetSiteDigestByUuid_WithPriorityDate()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            var site = new SitesDimFaker().Generate();
            var priorityDate = new DateTime(1980, 5, 15);

            var allocation = new AllocationAmountFactFaker()
                .LinkSites(site)
                .SetAllocationPriorityDate(priorityDate)
                .Generate();

            db.SitesDim.Add(site);
            db.AllocationAmountsFact.Add(allocation);
            db.SaveChanges();

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteDigestByUuid(site.SiteUuid);

            // Assert
            result.Should().NotBeNull();
            result.WaterRightsDigests.Should().HaveCount(1);
            result.WaterRightsDigests[0].PriorityDate.Should().Be(priorityDate);
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
        
        
        [TestMethod]
        public async Task SiteAccessor_GetSiteUsageBySiteUuid()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            
            var dates = new DateDimFaker().Generate(31);
            db.DateDim.AddRange(dates);
            await db.SaveChangesAsync();


            var siteDims = new SitesDimFaker().Generate(2);
            db.SitesDim.AddRange(siteDims);
            await db.SaveChangesAsync();

            var timeSeries = new List<SiteVariableAmountsFact>();
            
            foreach (var siteDim in siteDims)
            {
                timeSeries.AddRange(
                        new SiteVariableAmountsFactFaker()
                            .RuleFor(r => r.SiteId, siteDim.SiteId)
                            .RuleFor(r => r.Site, siteDim)
                            .RuleFor(r => r.TimeframeStartID, f => dates[f.Random.Int(0,30)].DateId)
                            .RuleFor(r => r.TimeframeEndID, dates[6].DateId)
                            .RuleFor(r => r.DataPublicationDateID, dates[6].DateId)
                            .Generate(10)
                );
            }
            
            await db.SiteVariableAmountsFact.AddRangeAsync(timeSeries);
            await db.SaveChangesAsync();
            
            db.SiteVariableAmountsFact.Should().HaveCount(20);
            
            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteUsageBySiteUuid(siteDims[0].SiteUuid);

            // Assert
            result.Should().HaveCount(10);
            result.Should().BeInAscendingOrder(x => x.TimeFrameStartDate);
        }
        
        [TestMethod]
        public async Task SiteAccessor_GetSiteUsageInfoListBySiteUuid()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var dates = new DateDimFaker().Generate(31);
            db.DateDim.AddRange(dates);
            await db.SaveChangesAsync();

            var siteDims = new SitesDimFaker().Generate(2);
            db.SitesDim.AddRange(siteDims);
            await db.SaveChangesAsync();

            var timeSeries = new List<SiteVariableAmountsFact>();

            foreach (var siteDim in siteDims)
            {
                timeSeries.AddRange(
                    new SiteVariableAmountsFactFaker()
                        .RuleFor(r => r.SiteId, siteDim.SiteId)
                        .RuleFor(r => r.Site, siteDim)
                        .RuleFor(r => r.TimeframeStartID, f => dates[f.Random.Int(0, 30)].DateId)
                        .RuleFor(r => r.TimeframeEndID, dates[6].DateId)
                        .RuleFor(r => r.DataPublicationDateID, dates[6].DateId)
                        .RuleFor(r => r.AllocationCropDutyAmount, f => f.Random.Double(1.0, 100.0))
                        .RuleFor(r => r.PopulationServed, f => f.Random.Long(100, 10000))
                        .Generate(10)
                );
            }

            await db.SiteVariableAmountsFact.AddRangeAsync(timeSeries);
            await db.SaveChangesAsync();

            db.SiteVariableAmountsFact.Should().HaveCount(20);

            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetSiteUsageInfoListBySiteUuid(siteDims[0].SiteUuid);

            // Assert
            result.Should().HaveCount(10);
            result.Should().BeInAscendingOrder(x => x.TimeframeStart);
        }

        [TestMethod]
        public async Task SiteAccessor_GetMethodInfoListBySiteUuid()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();

            var dates = new DateDimFaker().Generate(31);
            db.DateDim.AddRange(dates);
            await db.SaveChangesAsync();
            
            var siteDims = new SitesDimFaker().Generate(2);
            db.SitesDim.AddRange(siteDims);
            await db.SaveChangesAsync();

            var timeSeries = new List<SiteVariableAmountsFact>();
            
            foreach (var siteDim in siteDims)
            {
                var methodsDim = new MethodsDimFaker().Generate();
                
                timeSeries.AddRange(
                    new SiteVariableAmountsFactFaker()
                        .RuleFor(r => r.SiteId, siteDim.SiteId)
                        .RuleFor(r => r.Site, siteDim)
                        .RuleFor(r => r.TimeframeStartID, f => dates[f.Random.Int(0,30)].DateId)
                        .RuleFor(r => r.TimeframeEndID, dates[6].DateId)
                        .RuleFor(r => r.DataPublicationDateID, dates[6].DateId)
                        .RuleFor(r => r.Method, methodsDim)
                        .Generate(10)
                );
            }
            
            await db.SiteVariableAmountsFact.AddRangeAsync(timeSeries);
            await db.SaveChangesAsync();
            
            db.SiteVariableAmountsFact.Should().HaveCount(20);
            db.MethodsDim.Should().HaveCount(2);
            
            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetMethodInfoListByUuid(siteDims[0].SiteUuid);

            // Assert
            result.Should().HaveCount(1);
        }
        
        [TestMethod]
        public async Task WaterAllocationAccessor_GetVariableInfoListBySiteUuid()
        {
            // Arrange
            using var db = CreateDatabaseContextFactory().Create();
            
            var dates = new DateDimFaker().Generate(31);
            db.DateDim.AddRange(dates);
            await db.SaveChangesAsync();


            var siteDims = new SitesDimFaker().Generate(2);
            db.SitesDim.AddRange(siteDims);
            await db.SaveChangesAsync();

            var timeSeries = new List<SiteVariableAmountsFact>();
            
            foreach (var siteDim in siteDims)
            {
                var variablesDim = new VariablesDimFaker().Generate();
                timeSeries.AddRange(
                    new SiteVariableAmountsFactFaker()
                        .RuleFor(r => r.SiteId, siteDim.SiteId)
                        .RuleFor(r => r.Site, siteDim)
                        .RuleFor(r => r.TimeframeStartID, f => dates[f.Random.Int(0,30)].DateId)
                        .RuleFor(r => r.TimeframeEndID, dates[6].DateId)
                        .RuleFor(r => r.DataPublicationDateID, dates[6].DateId)
                        .RuleFor(r => r.VariableSpecific, _ => variablesDim)
                        .Generate(5)
                );
                
                var variablesDim2 = new VariablesDimFaker().Generate();
                timeSeries.AddRange(
                    new SiteVariableAmountsFactFaker()
                        .RuleFor(r => r.SiteId, siteDim.SiteId)
                        .RuleFor(r => r.Site, siteDim)
                        .RuleFor(r => r.TimeframeStartID, f => dates[f.Random.Int(0,30)].DateId)
                        .RuleFor(r => r.TimeframeEndID, dates[6].DateId)
                        .RuleFor(r => r.DataPublicationDateID, dates[6].DateId)
                        .RuleFor(r => r.VariableSpecific, _ => variablesDim2)
                        .Generate(5)
                );
            }
            
            await db.SiteVariableAmountsFact.AddRangeAsync(timeSeries);
            await db.SaveChangesAsync();
            
            db.SiteVariableAmountsFact.Should().HaveCount(20);
            db.VariablesDim.Should().HaveCount(4);
            
            // Act
            var accessor = CreateSiteAccessor();
            var result = await accessor.GetVariableInfoListByUuid(siteDims[0].SiteUuid);

            // Assert
            result.Should().HaveCount(2);
            result.Should().BeInAscendingOrder(x => x.WaDEVariableUuid, StringComparer.InvariantCulture);
        }
        
        private ISiteAccessor CreateSiteAccessor()
        {
            return new SiteAccessor(CreateLogger<SiteAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
