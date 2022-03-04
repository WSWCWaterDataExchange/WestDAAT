using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class WaterAllocationManagerTests : ManagerTestBase
    {
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
            _geoConnexEngineMock.Setup(x => x.BuildGeoConnexJson(It.IsAny<Site>(), It.IsAny<Organization>())).Returns("{Foo: \"bar\"}");
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).Returns(new Site
            {
                AllocationIds = new List<long> { 1, 2, 3 }
            });
            _waterAllocationAccessorMock.Setup(x => x.GetWaterAllocationAmountOrganizationById(It.IsAny<long>())).Returns(new Organization());

            var manager = new WaterAllocationManager(_siteAccessorMock.Object, _waterAllocationAccessorMock.Object, _geoConnexEngineMock.Object, CreateLogger<WaterAllocationManager>());

            // ACT 
            var response = manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");

            // ASSERT 
            _geoConnexEngineMock.Verify(t =>
                t.BuildGeoConnexJson(It.IsAny<Site>(), It.IsAny<Organization>()),
                Times.Once()
            );
        }

        [TestMethod]
        [ExpectedException(typeof(WestDaatException))]
        public void GeoConnexEngine_GetWaterAllocationSiteGeoconnexIntegrationData_MissingAllocations()
        {
            // ARRANGE 
            _siteAccessorMock.Setup(x => x.GetSiteByUuid(It.IsAny<string>())).Returns(new Site
            {
                AllocationIds = new List<long> { /* Empty */ }
            });

            var manager = new WaterAllocationManager(_siteAccessorMock.Object, _waterAllocationAccessorMock.Object, _geoConnexEngineMock.Object, CreateLogger<WaterAllocationManager>());

            // ACT 
            var response = manager.GetWaterAllocationSiteGeoconnexIntegrationData("test");
        }
    }
}
