using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class SystemManagerTests : ManagerTestBase
    {
        private readonly Mock<ISystemAccessor> _systemAccessorMock = new(MockBehavior.Strict);

        [TestMethod]
        public async Task GetAvailableBeneficialUseNormalizedNames_Success()
        {
            var faker = new Faker();
            var beneficialUse1 = faker.Random.AlphaNumeric(10);
            var beneficialUse2 = faker.Random.AlphaNumeric(10);

            _systemAccessorMock.Setup(a => a.GetAvailableBeneficialUseNormalizedNames())
                             .ReturnsAsync(new List<string> { beneficialUse1, beneficialUse2 })
                             .Verifiable();

            var sut = CreateSystemManager();
            var result = await sut.GetAvailableBeneficialUseNormalizedNames();

            result.Should().NotBeNull().And
                .BeEquivalentTo(new[] { beneficialUse2, beneficialUse1 });
            _systemAccessorMock.VerifyAll();
        }

        [TestMethod]
        public async Task GetAvailableOwnerClassificationNormalizedNames_Success()
        {
            var faker = new Faker();
            var ownerClassification1 = faker.Random.AlphaNumeric(10);
            var ownerClassification2 = faker.Random.AlphaNumeric(10);

            _systemAccessorMock.Setup(a => a.GetAvailableOwnerClassificationNormalizedNames())
                             .ReturnsAsync(new List<string> { ownerClassification1, ownerClassification2 })
                             .Verifiable();

            var sut = CreateSystemManager();
            var result = await sut.GetAvailableOwnerClassificationNormalizedNames();

            result.Should().NotBeNull().And
                .BeEquivalentTo(new[] { ownerClassification2, ownerClassification1 });
            _systemAccessorMock.VerifyAll();
        }

        [TestMethod]
        public async Task GetAvailableWaterSourceTypeNormalizedNames_Success()
        {
            var faker = new Faker();
            var waterSourceType1 = faker.Random.AlphaNumeric(10);
            var waterSourceType2 = faker.Random.AlphaNumeric(10);

            _systemAccessorMock.Setup(a => a.GetAvailableWaterSourceTypeNormalizedNames())
                             .ReturnsAsync(new List<string> { waterSourceType1, waterSourceType2 })
                             .Verifiable();

            var sut = CreateSystemManager();
            var result = await sut.GetAvailableWaterSourceTypeNormalizedNames();

            result.Should().NotBeNull().And
                .BeEquivalentTo(new[] { waterSourceType2, waterSourceType1 });
            _systemAccessorMock.VerifyAll();
        }

        private ISystemManager CreateSystemManager()
        {
            return new SystemManager(
                _systemAccessorMock.Object,
                CreateLogger<SystemManager>()
            );
        }
    }
}
