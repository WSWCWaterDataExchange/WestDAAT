using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;
using System.Transactions;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_WaterRightsControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
        {
            // Arrange
            await using var db = CreateDatabaseContextFactory().Create();

            var waterAllocationTypes = new WaterAllocationTypeCVFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .Generate(3);

            var beneficialUses = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .RuleFor(a => a.ConsumptionCategoryType, _ => Common.ConsumptionCategory.Consumptive)
                .Generate(2);

            var legalStatuses = new LegalStatusCVFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .Generate(2);

            var ownerClassifications = new OwnerClassificationCvFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .Generate(2);

            var siteTypes = new SiteTypeFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .Generate(2);

            var states = new StateFaker()
                .RuleFor(a => a.WaDEName, f => f.Address.StateAbbr())
                .Generate(2);

            var waterSourceTypes = new WaterSourceTypeFaker()
                .RuleFor(a => a.WaDEName, f => f.Random.Word())
                .Generate(2);

            db.WaterAllocationType.AddRange(waterAllocationTypes);
            db.BeneficialUsesCV.AddRange(beneficialUses);
            db.LegalStatus.AddRange(legalStatuses);
            db.OwnerClassificationCv.AddRange(ownerClassifications);
            db.SiteType.AddRange(siteTypes);
            db.State.AddRange(states);
            db.WaterSourceType.AddRange(waterSourceTypes);

            await db.SaveChangesAsync();

            var accessor = CreateSystemAccessor();

            // Act
            DashboardFilters result;
            using (var scope = new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
            {
                result = await accessor.LoadFilters();
                scope.Complete();
            }
            var waterRights = result.WaterRights;

            // Assert
            waterRights.AllocationTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.BeneficialUses.Should().BeInAscendingOrder(b => b.BeneficialUseName).And.OnlyHaveUniqueItems(b => b.BeneficialUseName);
            waterRights.LegalStatuses.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.OwnerClassifications.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.SiteTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.States.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.WaterSourceTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        }

        private ISystemAccessor CreateSystemAccessor()
        {
            return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
        }
    }
}