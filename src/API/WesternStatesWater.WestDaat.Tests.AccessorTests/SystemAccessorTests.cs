using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    [TestCategory("Accessor Tests")]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task GetAvailableBeneficialUseNormalizedNames_RemovesDuplicates()
        {
            var duplicateBeneficialUses = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .Generate(2);
            var uniqueBeneficialUse = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, b => "Unique Name")
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.BeneficialUsesCV.AddRange(duplicateBeneficialUses);
                db.BeneficialUsesCV.Add(uniqueBeneficialUse);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableBeneficialUseNormalizedNames();

            var expectedResult1 = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = "Unique Name",
                ConsumptionCategory = Common.ConsumptionCategory.NonConsumptive,
            };

            var expectedResult2 = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = "Duplicate Name",
                ConsumptionCategory = Common.ConsumptionCategory.NonConsumptive,
            };

            result.Should().NotBeNull().And
                   .BeEquivalentTo(new Common.DataContracts.BeneficialUseItem[] {expectedResult1, expectedResult2 });
        }

        [TestMethod]
        public async Task GetAvailableBeneficialUseNormalizedNames_RemovesMultipleConsumptionTypes()
        {
            var beneficialUseConsumptive = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .RuleFor(a => a.ConsumptionCategoryType, b => Common.ConsumptionCategory.Consumptive)
                .Generate();
            var beneficialUseNonconsumptive = new BeneficialUsesCVFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .RuleFor(a => a.ConsumptionCategoryType, b => Common.ConsumptionCategory.NonConsumptive)
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.BeneficialUsesCV.Add(beneficialUseConsumptive);
                db.BeneficialUsesCV.Add(beneficialUseNonconsumptive);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableBeneficialUseNormalizedNames();

            var expectedResult = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = "Duplicate Name",
                ConsumptionCategory = Common.ConsumptionCategory.NonConsumptive,
            };

            result.Should().NotBeNull().And
                   .BeEquivalentTo(new Common.DataContracts.BeneficialUseItem[] { expectedResult });
        }

        [DataTestMethod]
        [DataRow("Name1", null, "Name1")]
        [DataRow("Name1", "", "Name1")]
        [DataRow("Name1", "Name2", "Name2")]
        public async Task GetAvailableBeneficialUseNormalizedNames_UseWaDENameWhenAvailable(string name, string waDEName, string expectedBeneficialUseName)
        {
            var uniqueBeneficialUse = new BeneficialUsesCVFaker()
                .RuleFor(a => a.Name, b => name)
                .RuleFor(a => a.WaDEName, b => waDEName)
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.BeneficialUsesCV.Add(uniqueBeneficialUse);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableBeneficialUseNormalizedNames();


            var expectedResult = new Common.DataContracts.BeneficialUseItem
            {
                BeneficialUseName = expectedBeneficialUseName,
                ConsumptionCategory = Common.ConsumptionCategory.NonConsumptive,
            };

            result.Should().NotBeNull().And
                   .BeEquivalentTo(new Common.DataContracts.BeneficialUseItem[] { expectedResult });
        }

        [TestMethod]
        public async Task GetAvailableOwnerClassificationNormalizedNames_RemovesDuplicates()
        {
            var duplicateOwnerClassifications = new OwnerClassificationCvFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .Generate(2);
            var uniqueOwnerClassification = new OwnerClassificationCvFaker()
                .RuleFor(a => a.WaDEName, b => "Unique Name")
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.OwnerClassificationCv.AddRange(duplicateOwnerClassifications);
                db.OwnerClassificationCv.Add(uniqueOwnerClassification);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableOwnerClassificationNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { "Unique Name", "Duplicate Name" });
        }

        [DataTestMethod]
        [DataRow("Name1", null, "Name1")]
        [DataRow("Name1", "", "Name1")]
        [DataRow("Name1", "Name2", "Name2")]
        public async Task GetAvailableOwnerClassificationNormalizedNames_UseWaDENameWhenAvailable(string name, string waDEName, string expectedResult)
        {
            var uniqueOwnerClassification = new OwnerClassificationCvFaker()
                .RuleFor(a => a.Name, b => name)
                .RuleFor(a => a.WaDEName, b => waDEName)
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.OwnerClassificationCv.Add(uniqueOwnerClassification);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableOwnerClassificationNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { expectedResult });
        }

        [TestMethod]
        public async Task GetAvailableWaterSourceTypeNormalizedNames_RemovesDuplicates()
        {
            var duplicateWaterSourceTypes = new WaterSourceTypeFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .Generate(2);
            var uniqueWaterSourceType = new WaterSourceTypeFaker()
                .RuleFor(a => a.WaDEName, b => "Unique Name")
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.WaterSourceType.AddRange(duplicateWaterSourceTypes);
                db.WaterSourceType.Add(uniqueWaterSourceType);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableWaterSourceTypeNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { "Unique Name", "Duplicate Name" });
        }

        [DataTestMethod]
        [DataRow("Name1", null, "Name1")]
        [DataRow("Name1", "", "Name1")]
        [DataRow("Name1", "Name2", "Name2")]
        public async Task GetAvailableWaterSourceTypeNormalizedNames_UseWaDENameWhenAvailable(string name, string waDEName, string expectedResult)
        {
           var uniqueWaterSourceType = new WaterSourceTypeFaker()
                .RuleFor(a => a.Name, b => name)
                .RuleFor(a => a.WaDEName, b => waDEName)
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.WaterSourceType.Add(uniqueWaterSourceType);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableWaterSourceTypeNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { expectedResult });
        }

        [TestMethod]
        public async Task GetAvailableStateNormalizedNames_RemovesDuplicates()
        {
            var duplicateOwnerClassifications = new StateFaker()
                .RuleFor(a => a.WaDEName, b => "Duplicate Name")
                .Generate(2);
            var uniqueOwnerClassification = new StateFaker()
                .RuleFor(a => a.WaDEName, b => "Unique Name")
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.State.AddRange(duplicateOwnerClassifications);
                db.State.Add(uniqueOwnerClassification);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableStateNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { "Unique Name", "Duplicate Name" });
        }

        [DataTestMethod]
        [DataRow("NE", null, "NE")]
        [DataRow("NE", "", "NE")]
        [DataRow("NE", "CA", "CA")]
        public async Task GetAvailableStateNormalizedNames_UseWaDENameWhenAvailable(string name, string waDEName, string expectedResult)
        {
            var uniqueOwnerClassification = new StateFaker()
                .RuleFor(a => a.Name, b => name)
                .RuleFor(a => a.WaDEName, b => waDEName)
                .Generate();
            using (var db = CreateDatabaseContextFactory().Create())
            {
                db.State.Add(uniqueOwnerClassification);
                db.SaveChanges();
            }

            var accessor = CreateSystemAccessor();
            var result = await accessor.GetAvailableStateNormalizedNames();

            result.Should().NotBeNull().And
                  .BeEquivalentTo(new[] { expectedResult });
        }

        private ISystemAccessor CreateSystemAccessor()
        {
            return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
