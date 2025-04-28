using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WaDE.Database.EntityFramework;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_ControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
        {
            List<WaterAllocationType> waterAllocationTypes =
            [
                new WaterAllocationTypeCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 1")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new WaterAllocationTypeCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 2")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new WaterAllocationTypeCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 3")
                    .RuleFor(a => a.WaDEName, _ => "Official Name")
                    .Generate()
            ];

            var duplicateBeneficialUses = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, _ => "Duplicate Name")
                .RuleFor(a => a.ConsumptionCategoryType, _ => Common.ConsumptionCategory.Consumptive)
                .Generate(2);
            var uniqueBeneficialUse = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, _ => "Unique Name")
                .RuleFor(a => a.ConsumptionCategoryType, _ => Common.ConsumptionCategory.NonConsumptive)
                .Generate();
            List<BeneficialUsesCV> beneficialUses = [];
            beneficialUses.AddRange(duplicateBeneficialUses);
            beneficialUses.Add(uniqueBeneficialUse);

            List<LegalStatus> legalStatuses =
            [
                new LegalStatusCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 1")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new LegalStatusCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 2")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new LegalStatusCVFaker()
                    .RuleFor(a => a.Name, _ => "Name 3")
                    .RuleFor(a => a.WaDEName, _ => "Official Name")
                    .Generate()
            ];

            List<OwnerClassificationCv> ownerClassifications =
            [
                new OwnerClassificationCvFaker()
                    .RuleFor(a => a.Name, _ => "Name 1")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new OwnerClassificationCvFaker()
                    .RuleFor(a => a.Name, _ => "Name 2")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new OwnerClassificationCvFaker()
                    .RuleFor(a => a.Name, _ => "Name 3")
                    .RuleFor(a => a.WaDEName, _ => "Official Name")
                    .Generate()
            ];

            List<SiteType> siteTypes =
            [
                new SiteTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 1")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new SiteTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 2")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new SiteTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 3")
                    .RuleFor(a => a.WaDEName, _ => "Official Name")
                    .Generate()
            ];

            List<State> states =
            [
                new StateFaker()
                    .RuleFor(a => a.Name, _ => "A")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new StateFaker()
                    .RuleFor(a => a.Name, _ => "B")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new StateFaker()
                    .RuleFor(a => a.Name, _ => "C")
                    .RuleFor(a => a.WaDEName, _ => "Z")
                    .Generate()
            ];

            List<WaterSourceType> waterSourceTypes =
            [
                new WaterSourceTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 1")
                    .RuleFor(a => a.WaDEName, _ => null)
                    .Generate(),

                new WaterSourceTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 2")
                    .RuleFor(a => a.WaDEName, _ => "")
                    .Generate(),

                new WaterSourceTypeFaker()
                    .RuleFor(a => a.Name, _ => "Name 3")
                    .RuleFor(a => a.WaDEName, _ => "Official Name")
                    .Generate()
            ];

         
            await using var db = CreateDatabaseContextFactory().Create();
            db.WaterAllocationType.AddRange(waterAllocationTypes);
            db.BeneficialUsesCV.AddRange(beneficialUses);
            db.LegalStatus.AddRange(legalStatuses);
            db.OwnerClassificationCv.AddRange(ownerClassifications);
            db.SiteType.AddRange(siteTypes);
            db.State.AddRange(states);
            db.WaterSourceType.AddRange(waterSourceTypes);
            await db.SaveChangesAsync();

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

            result.WaterRights.RiverBasins.Should()
                .BeInAscendingOrder()
                .And
                .OnlyHaveUniqueItems()
                .And
                .BeEquivalentTo(["Basin A", "Basin B", "Official Basin"]);
        }

        private ISystemAccessor CreateSystemAccessor()
        {
            return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
        }
    }
}