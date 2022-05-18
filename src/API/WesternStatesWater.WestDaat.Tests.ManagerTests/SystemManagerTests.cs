using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class SystemManagerTests : ManagerTestBase
    {
        private readonly Mock<ILocationEngine> _locationEngineMock = new(MockBehavior.Strict);

        private readonly Mock<ISystemAccessor> _systemAccessorMock = new(MockBehavior.Strict);

        [TestMethod]
        public async Task GetAvailableBeneficialUseNormalizedNames_Success()
        {
            var faker = new Faker();

            var beneficialUse1 = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = faker.Random.AlphaNumeric(10),
                ConsumptionCategory = Common.ConsumptionCategory.Consumptive,
            };
            var beneficialUse2 = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = faker.Random.AlphaNumeric(10),
                ConsumptionCategory = Common.ConsumptionCategory.Consumptive,
            };

            _systemAccessorMock.Setup(a => a.GetAvailableBeneficialUseNormalizedNames())
                        .ReturnsAsync(new List<Common.DataContracts.BeneficialUseItem> { beneficialUse1, beneficialUse2 })
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

        [TestMethod]
        public async Task GetAvailableStateNormalizedNames_Success()
        {
            var faker = new Faker();
            var state1 = faker.Address.StateAbbr();
            var state2 = faker.Address.StateAbbr();

            _systemAccessorMock.Setup(a => a.GetAvailableStateNormalizedNames())
                             .ReturnsAsync(new List<string> { state1, state2 })
                             .Verifiable();

            var sut = CreateSystemManager();
            var result = await sut.GetAvailableStateNormalizedNames();

            result.Should().NotBeNull().And
                .BeEquivalentTo(new[] { state2, state1 });
            _systemAccessorMock.VerifyAll();
        }

        private ISystemManager CreateSystemManager()
        {
            return new SystemManager(
                _locationEngineMock.Object,
                _systemAccessorMock.Object,
                CreateLogger<SystemManager>()
            );
        }
    }
}
