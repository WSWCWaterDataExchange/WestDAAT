using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_WaterRightsControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
        {
            await using var db = CreateEnlistFalseFactory().Create();

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

            ISystemAccessor accessor = new SystemAccessor(
                CreateLogger<SystemAccessor>(),
                CreateEnlistFalseFactory());

            // Act
            var result = await accessor.LoadFilters();
            var waterRights = result.WaterRights;

            // Assert
            waterRights.AllocationTypes
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.BeneficialUses
                .Should().BeInAscendingOrder(b => b.BeneficialUseName)
                .And.OnlyHaveUniqueItems(b => b.BeneficialUseName);
            waterRights.LegalStatuses
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.OwnerClassifications
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.SiteTypes
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.States
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
            waterRights.WaterSourceTypes
                .Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        }

        private IDatabaseContextFactory CreateEnlistFalseFactory()
        {
            var baseFactory = base.CreateDatabaseContextFactory();
            return new DatabaseContextFactoryWithEnlistFalse(baseFactory);
        }

        private class DatabaseContextFactoryWithEnlistFalse : IDatabaseContextFactory
        {
            private readonly IDatabaseContextFactory _inner;
            public DatabaseContextFactoryWithEnlistFalse(IDatabaseContextFactory inner)
                => _inner = inner;

            public DatabaseContext Create()
            {
                var ctx = _inner.Create();
                var csb = new Microsoft.Data.SqlClient.SqlConnectionStringBuilder(
                    ctx.Database.GetConnectionString())
                {
                    Enlist = false
                };
                ctx.Database.SetConnectionString(csb.ToString());
                return ctx;
            }
        }
    }
}
