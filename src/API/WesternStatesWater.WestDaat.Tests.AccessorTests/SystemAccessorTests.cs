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
    // Arrange
    await using var db = CreateDatabaseContextFactory().Create();

    // Seed WaterAllocationType
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
    db.WaterAllocationType.AddRange(waterAllocationTypes);

    // Seed BeneficialUsesCV
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
    db.BeneficialUsesCV.AddRange(beneficialUses);

    // Seed LegalStatus
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
    db.LegalStatus.AddRange(legalStatuses);

    // Seed OwnerClassificationCv
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
    db.OwnerClassificationCv.AddRange(ownerClassifications);

    // Seed SiteType
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
    db.SiteType.AddRange(siteTypes);

    // Seed State
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
    db.State.AddRange(states);

    // Seed WaterSourceType
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
    db.WaterSourceType.AddRange(waterSourceTypes);

    // Seed required related tables
    var organization = new OrganizationsDim { OrganizationUuid = "org1" };
    db.OrganizationsDim.Add(organization);

    var variable = new VariablesDim { VariableSpecificUuid = "var1" };
    db.VariablesDim.Add(variable);

    // Save changes to generate primary keys
    await db.SaveChangesAsync();

    // Seed AllocationAmountsFact for AllocationTypes
    var allocationAmounts = waterAllocationTypes.Select((w, index) => new AllocationAmountsFact
    {
        AllocationAmountId = index + 1, // Assuming an int PK
        AllocationTypeCv = w.Name,
        OrganizationId = organization.OrganizationId, // Use the generated long PK
        VariableSpecificId = variable.VariableSpecificId // Use the generated long PK
    }).ToList();
    db.AllocationAmountsFact.AddRange(allocationAmounts);

    // Seed AllocationBridgeBeneficialUsesFact for BeneficialUses
    var bridgeRecords = beneficialUses.Select((b, index) => new AllocationBridgeBeneficialUsesFact
    {
        AllocationBridgeId = index + 1, // Assuming an int PK
        AllocationAmountId = allocationAmounts[0].AllocationAmountId,
        BeneficialUseCV = b.Name
    }).ToList();
    db.AllocationBridgeBeneficialUsesFact.AddRange(bridgeRecords);

    await db.SaveChangesAsync();

    // Act
    var accessor = CreateSystemAccessor();
    var result = await accessor.LoadFilters();

    // Assert
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