using System.Collections.Generic;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_ControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
        {
            var waterAllocationTypes = new List<WaterAllocationType>
            {
                new WaterAllocationTypeCVFaker().RuleFor(a => a.Name, _ => "Name 1").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new WaterAllocationTypeCVFaker().RuleFor(a => a.Name, _ => "Name 2").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new WaterAllocationTypeCVFaker().RuleFor(a => a.Name, _ => "Name 3").RuleFor(a => a.WaDEName, _ => "Official Name").Generate()
            };

            var duplicateUses = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, _ => "Dup")
                .RuleFor(a => a.ConsumptionCategoryType, _ => Common.ConsumptionCategory.Consumptive)
                .Generate(2);
            var uniqueUse = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, _ => "Uniq")
                .RuleFor(a => a.ConsumptionCategoryType, _ => Common.ConsumptionCategory.NonConsumptive)
                .Generate();
            var beneficialUses = new List<BeneficialUsesCV>();
            beneficialUses.AddRange(duplicateUses);
            beneficialUses.Add(uniqueUse);

            var legalStatuses = new List<LegalStatus>
            {
                new LegalStatusCVFaker().RuleFor(a => a.Name, _ => "Name 1").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new LegalStatusCVFaker().RuleFor(a => a.Name, _ => "Name 2").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new LegalStatusCVFaker().RuleFor(a => a.Name, _ => "Name 3").RuleFor(a => a.WaDEName, _ => "Official Name").Generate()
            };

            var ownerClasses = new List<OwnerClassificationCv>
            {
                new OwnerClassificationCvFaker().RuleFor(a => a.Name, _ => "Name 1").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new OwnerClassificationCvFaker().RuleFor(a => a.Name, _ => "Name 2").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new OwnerClassificationCvFaker().RuleFor(a => a.Name, _ => "Name 3").RuleFor(a => a.WaDEName, _ => "Official Name").Generate()
            };

            var siteTypes = new List<SiteType>
            {
                new SiteTypeFaker().RuleFor(a => a.Name, _ => "Name 1").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new SiteTypeFaker().RuleFor(a => a.Name, _ => "Name 2").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new SiteTypeFaker().RuleFor(a => a.Name, _ => "Name 3").RuleFor(a => a.WaDEName, _ => "Official Name").Generate()
            };

            var states = new List<State>
            {
                new StateFaker().RuleFor(a => a.Name, _ => "A").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new StateFaker().RuleFor(a => a.Name, _ => "B").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new StateFaker().RuleFor(a => a.Name, _ => "C").RuleFor(a => a.WaDEName, _ => "Z").Generate()
            };

            var waterSources = new List<WaterSourceType>
            {
                new WaterSourceTypeFaker().RuleFor(a => a.Name, _ => "Name 1").RuleFor(a => a.WaDEName, _ => null).Generate(),
                new WaterSourceTypeFaker().RuleFor(a => a.Name, _ => "Name 2").RuleFor(a => a.WaDEName, _ => "").Generate(),
                new WaterSourceTypeFaker().RuleFor(a => a.Name, _ => "Name 3").RuleFor(a => a.WaDEName, _ => "Official Name").Generate()
            };

            await using (var db = CreateDatabaseContextFactory().Create())
            {
                db.WaterAllocationType.AddRange(waterAllocationTypes);
                db.BeneficialUsesCV.AddRange(beneficialUses);
                db.LegalStatus.AddRange(legalStatuses);
                db.OwnerClassificationCv.AddRange(ownerClasses);
                db.SiteType.AddRange(siteTypes);
                db.State.AddRange(states);
                db.WaterSourceType.AddRange(waterSources);
                await db.SaveChangesAsync();
            }

            // ACT
            var accessor = CreateSystemAccessor();
            var result   = await accessor.LoadFilters();

            // ASSERT
            result.WaterRights.AllocationTypes
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Name 1","Name 2","Official Name");

            result.WaterRights.BeneficialUses
                  .Select(b => b.BeneficialUseName)
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Dup","Uniq");

            result.WaterRights.LegalStatuses
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Name 1","Name 2","Official Name");

            result.WaterRights.OwnerClassifications
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Name 1","Name 2","Official Name");

            result.WaterRights.SiteTypes
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Name 1","Name 2","Official Name");

            result.WaterRights.States
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("A","B","Z");

            result.WaterRights.WaterSourceTypes
                  .Should().BeInAscendingOrder()
                  .And.OnlyHaveUniqueItems()
                  .And.BeEquivalentTo("Name 1","Name 2","Official Name");
        }

        private ISystemAccessor CreateSystemAccessor()
            => new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
    }
}
