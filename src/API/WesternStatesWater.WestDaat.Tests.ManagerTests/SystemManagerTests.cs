using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using DashboardFilters = WesternStatesWater.WestDaat.Common.DataContracts.DashboardFilters;

namespace WesternStatesWater.WestDaat.Tests.ManagerTests
{
    [TestClass]
    public class SystemManagerTests : ManagerTestBase
    {
        private readonly Mock<ILocationEngine> _locationEngineMock = new(MockBehavior.Strict);

        private readonly Mock<ISystemAccessor> _systemAccessorMock = new(MockBehavior.Strict);

        [TestMethod]
        public async Task SystemManager_LoadFilters_ShouldBeEquivalent()
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

            var ownerClassification1 = faker.Random.AlphaNumeric(10);
            var ownerClassification2 = faker.Random.AlphaNumeric(10);
            
            var waterSourceType1 = faker.Random.AlphaNumeric(10);
            var waterSourceType2 = faker.Random.AlphaNumeric(10);
            
            var state1 = faker.Address.StateAbbr();
            var state2 = faker.Address.StateAbbr();

            _systemAccessorMock.Setup(a => a.LoadFilters())
                .ReturnsAsync(new DashboardFilters
                {
                    AllocationTypes = null,
                    BeneficialUses = [beneficialUse1, beneficialUse2],
                    LegalStatuses = null,
                    OwnerClassifications = [ownerClassification1, ownerClassification2],
                    RiverBasins = null,
                    SiteTypes = null,
                    States = [state1, state2],
                    WaterSources = [waterSourceType1, waterSourceType2]
                })
                .Verifiable();

            var sut = CreateSystemManager();
            var result = await sut.LoadFilters();

            result.BeneficialUses.Should().NotBeNull().And
                .BeEquivalentTo([beneficialUse2, beneficialUse1]);
            result.OwnerClassifications.Should().NotBeNull().And
                .BeEquivalentTo(ownerClassification2, ownerClassification1);
            result.States.Should().NotBeNull().And
                .BeEquivalentTo(state2, state1);
            result.WaterSources.Should().NotBeNull().And
                .BeEquivalentTo(waterSourceType2, waterSourceType1);

            _systemAccessorMock.VerifyAll();
        }
        
        private ISystemManager CreateSystemManager()
        {
            return new SystemManager(
                _locationEngineMock.Object,
                _systemAccessorMock.Object,
                ManagerRequestHandlerResolverMock.Object,
                ValidationEngineMock.Object,
                CreateLogger<SystemManager>()
            );
        }
    }
}