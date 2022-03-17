using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using DC = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class WaterAllocationManagerTests : ManagerTestBase
    {
        private readonly Mock<INldiAccessor> _nldiAccessorMock = new(MockBehavior.Strict);
        private readonly Mock<IGeoConnexEngine> _geoConnexEngineMock = new Mock<IGeoConnexEngine>(MockBehavior.Strict);
        private readonly Mock<ISiteAccessor> _siteAccessorMock = new Mock<ISiteAccessor>(MockBehavior.Strict);
        private readonly Mock<IWaterAllocationAccessor> _waterAllocationAccessorMock = new Mock<IWaterAllocationAccessor>(MockBehavior.Strict);

        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestMethod]
        public void GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_ShouldCallEngine()
        {
            // ARRANGE 
            _geoConnexEngineMock.Setup(x => x.BuildGeoConnexJson(It.IsAny<DC.Site>(), It.IsAny<DC.Organization>())).Returns("{Foo: \"bar\"}");
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).Returns(new DC.Site
            {
                AllocationIds = new List<long> { 1, 2, 3 }
            });
            _waterAllocationAccessorMock.Setup(x => x.GetWaterAllocationAmountOrganizationById(It.IsAny<long>())).Returns(new DC.Organization());

            var manager = CreateWaterAllocationManager();

            // ACT 
            var response = manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");

            // ASSERT 
            _geoConnexEngineMock.Verify(t =>
                t.BuildGeoConnexJson(It.IsAny<DC.Site>(), It.IsAny<DC.Organization>()),
                Times.Once()
            );
        }

        [TestMethod]
        [ExpectedException(typeof(WestDaatException))]
        public void GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_MissingAllocations()
        {
            // ARRANGE 
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).Returns(new DC.Site
            {
                AllocationIds = new List<long> { /* Empty */ }
            });

            var manager = CreateWaterAllocationManager();

            // ACT 
            var response = manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");
        }

        [TestMethod]
        public async Task GetNldiFeatures_Success()
        {
            var faker = new Faker();
            var latitude = faker.Random.Double();
            var longitude = faker.Random.Double();
            var directions = faker.Random.Enum<DC.NldiDirections>();
            var dataPoints = faker.Random.Enum<DC.NldiDataPoints>();

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
        public async Task WaterAllocationManager_GetSiteDetails()
        {
            _siteAccessorMock.Setup(x => x.GetSiteDetailsByUuid("TESTME")).ReturnsAsync(new DC.SiteDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetSiteDetails("TESTME");

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightDetails()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightDetailsById(99)).ReturnsAsync(new DC.WaterRightDetails()).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightDetails(99);

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSiteInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSiteInfoById(99)).ReturnsAsync(new DC.SiteInfoListItem[] { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSiteInfoList(99);

            result.Should().NotBeNull();
            _siteAccessorMock.Verify();
        }

        [TestMethod]
        public async Task WaterAllocationManager_GetWaterRightSourceInfoList()
        {
            _waterAllocationAccessorMock.Setup(x => x.GetWaterRightSourceInfoById(99)).ReturnsAsync(new DC.WaterSourceInfoListItem[] { }).Verifiable();

            var manager = CreateWaterAllocationManager();
            var result = await manager.GetWaterRightSourceInfoList(99);

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
