using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;
using Common = WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class WaterAllocationManagerTests : ManagerTestBase
    {
        private readonly Mock<INldiAccessor> _nldiAccessorMock = new(MockBehavior.Strict);
        private readonly Mock<IGeoConnexEngine> _geoConnexEngineMock = new Mock<IGeoConnexEngine>(MockBehavior.Strict);
        private readonly Mock<ISiteAccessor> _siteAccessorMock = new Mock<ISiteAccessor>(MockBehavior.Strict);
        private readonly Mock<IWaterAllocationAccessor> _waterAllocationAccessorMock = new Mock<IWaterAllocationAccessor>(MockBehavior.Strict);

        [TestMethod]
        public async Task GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_ShouldCallEngine()
        {
            // ARRANGE 
            _geoConnexEngineMock.Setup(x => x.BuildGeoConnexJson(It.IsAny<CommonContracts.Site>(), It.IsAny<CommonContracts.Organization>())).Returns("{Foo: \"bar\"}");
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).ReturnsAsync(new CommonContracts.Site
            {
                AllocationIds = new List<long> { 1, 2, 3 }
            });
            _waterAllocationAccessorMock.Setup(x => x.GetWaterAllocationAmountOrganizationById(It.IsAny<long>())).Returns(new CommonContracts.Organization());

            var manager = CreateWaterAllocationManager();

            // ACT 
            var response = await manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");

            // ASSERT 
            response.Should().NotBeNull();
            _geoConnexEngineMock.Verify(t =>
                t.BuildGeoConnexJson(It.IsAny<CommonContracts.Site>(), It.IsAny<CommonContracts.Organization>()),
                Times.Once()
            );
        }

        [TestMethod]
        public async Task GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_MissingAllocations()
        {
            // ARRANGE 
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).ReturnsAsync(new CommonContracts.Site
            {
                AllocationIds = new List<long> { /* Empty */ }
            });

            var manager = CreateWaterAllocationManager();

            // ACT 
            Func<Task> call = async () => await manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");
            await call.Should().ThrowAsync<WestDaatException>();
        }

        [TestMethod]
        public async Task GetNldiFeatures_Success()
        {
            var faker = new Faker();
            var latitude = faker.Random.Double();
            var longitude = faker.Random.Double();
            var directions = faker.Random.Enum<Common.NldiDirections>();
            var dataPoints = faker.Random.Enum<Common.NldiDataPoints>();

            var resultFeatureCollection = new FeatureCollection();

            _nldiAccessorMock.Setup(a => a.GetNldiFeatures(latitude, longitude, directions, dataPoints))
                             .ReturnsAsync(resultFeatureCollection)
                             .Verifiable();

            var sut = CreateWaterAllocationManager();
            var result = await sut.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            result.Should().Be(resultFeatureCollection);
            _nldiAccessorMock.VerifyAll();
        }

        [TestMethod]
        public async Task WaterAllocationManager_FindWaterRights()
        {
            //Arrange
            _waterAllocationAccessorMock.Setup(x => x.FindWaterRights(It.IsAny<CommonContracts.WaterRightsSearchCriteria>()))
                .ReturnsAsync(new CommonContracts.WaterRightsSearchResults
                {
                    CurrentPageNumber = 0,
                    WaterRightsDetails = new CommonContracts.WaterRightsSearchDetail[]
                    {
                        new CommonContracts.WaterRightsSearchDetail
                        {
                            AllocationUuid = "abc123"
                        }
                    }
                })
                .Verifiable();

            var searchCriteria = new WaterRightsSearchCriteria();

            //Act
            var manager = CreateWaterAllocationManager();
            var result = await manager.FindWaterRights(searchCriteria);

            //Assert
            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetSiteDetails()
        {
            _siteAccessorMock.Setup(x => x.GetSiteDetailsByUuid("TESTME")).ReturnsAsync(new CommonContracts.SiteDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetSiteDetails("TESTME");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterSiteLocation()
        {
            var location = new CommonContracts.SiteLocation
            {
                Latitude = 999,
                Longitude = 888,
                PODorPOUSite = "TEST_PODorPOU",
                SiteUuid = "TEST_PODorPOU"
            };

            _siteAccessorMock.Setup(x => x.GetWaterSiteLocationByUuid("TEST_PODorPOU")).ReturnsAsync(location).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterSiteLocation("TEST_PODorPOU");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();

            result.Properties.First(x => x.Key.ToLower() == "siteuuid").Value.Should().Be(location.SiteUuid);
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightDetails()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightDetailsById(99)).ReturnsAsync(new CommonContracts.WaterRightDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightDetails(99);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSiteInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSiteInfoById(99)).ReturnsAsync(new List<CommonContracts.SiteInfoListItem>{ }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSiteInfoList(99);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSourceInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSourceInfoById(99)).ReturnsAsync(new List<CommonContracts.WaterSourceInfoListItem>{ }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSourceInfoList(99);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightsDigestsBySite()
        {
            var siteUuid = new Faker().Random.String(11, 'A', 'z');
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightsDigestsBySite(siteUuid)).ReturnsAsync(new List<CommonContracts.WaterRightsDigest> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightsDigestsBySite(siteUuid);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSiteLocations()
        {
            var location = new CommonContracts.SiteLocation
            {
                Latitude = 999,
                Longitude = 888,
                PODorPOUSite = "TEST_PODorPOU",
                SiteUuid = "TEST_PODorPOU"
            };

            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSiteLocationsById(99)).ReturnsAsync(new List<CommonContracts.SiteLocation> { location }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSiteLocations(99);

            result.Should().NotBeNull();
            _waterAllocationAccessorMock.Verify();

            result.Features.Count.Should().Be(1);
            result.Features[0].Properties.First(x => x.Key.ToLower() == "siteuuid").Value.Should().Be(location.SiteUuid);
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterSiteSourceInfoList()
        {
            _siteAccessorMock.Setup(x => x.GetWaterSiteSourceInfoListByUuid("siteuuid")).ReturnsAsync(new List<CommonContracts.WaterSourceInfoListItem> { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterSiteSourceInfoListByUuid("siteuuid");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        private IWaterAllocationManager CreateWaterAllocationManager()
        {
            return new WaterAllocationManager(
                _nldiAccessorMock.Object,
                _siteAccessorMock.Object,
                _waterAllocationAccessorMock.Object,
                _geoConnexEngineMock.Object,
                CreateLogger<WaterAllocationManager>()
            );
        }
    }
}
