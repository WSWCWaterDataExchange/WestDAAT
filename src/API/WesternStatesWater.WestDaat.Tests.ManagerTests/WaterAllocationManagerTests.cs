using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Contracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class WaterAllocationManagerTests : ManagerTestBase
    {
        private readonly Mock<INldiAccessor> _nldiAccessorMock = new(MockBehavior.Strict);

        [TestMethod]
        public async Task GetNldiFeatures_Success()
        {
            var faker = new Faker();
            var latitude = faker.Random.Double();
            var longitude = faker.Random.Double();
            var directions = faker.Random.Enum<NldiDirections>();
            var dataPoints = faker.Random.Enum<NldiDataPoints>();

            var resultFeatureCollection = new FeatureCollection();

            _nldiAccessorMock.Setup(a => a.GetNldiFeatures(latitude, longitude, directions, dataPoints))
                             .ReturnsAsync(resultFeatureCollection)
                             .Verifiable();

            var sut = CreateWaterAllocationManager();
            var result = await sut.GetNldiFeatures(latitude, longitude, directions, dataPoints);

            result.Should().Be(resultFeatureCollection);
            _nldiAccessorMock.VerifyAll();
        }

        private IWaterAllocationManager CreateWaterAllocationManager()
        {
            return new WaterAllocationManager(_nldiAccessorMock.Object, CreateLogger<WaterAllocationManager>());
        }
    }
}
