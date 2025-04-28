using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_ControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
        {
            var accessor = CreateSystemAccessor();
            var result = await accessor.LoadFilters();

            result.WaterRights.AllocationTypes.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Name 1", "Name 2", "Official Name"]);

            result.WaterRights.BeneficialUses.Should()
                .BeInAscendingOrder(b => b.BeneficialUseName)
                .And
                .OnlyHaveUniqueItems(b => b.BeneficialUseName)
                .And
                .BeEquivalentTo([
                    new Common.DataContracts.BeneficialUseItem
                    {
                        BeneficialUseName = "Duplicate Name",
                        ConsumptionCategory = Common.ConsumptionCategory.Consumptive,
                    },
                    new Common.DataContracts.BeneficialUseItem
                    {
                        BeneficialUseName = "Unique Name",
                        ConsumptionCategory = Common.ConsumptionCategory.NonConsumptive,
                    }
                ]);

            result.WaterRights.LegalStatuses.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Name 1", "Name 2", "Official Name"]);

            result.WaterRights.OwnerClassifications.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Name 1", "Name 2", "Official Name"]);

            result.WaterRights.SiteTypes.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Name 1", "Name 2", "Official Name"]);

            result.WaterRights.States.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["A", "B", "Z"]);

            result.WaterRights.WaterSourceTypes.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Name 1", "Name 2", "Official Name"]);
        }

        private ISystemAccessor CreateSystemAccessor()
        {
            return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
