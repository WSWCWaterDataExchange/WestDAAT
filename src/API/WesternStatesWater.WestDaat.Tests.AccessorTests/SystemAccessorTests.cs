using FluentAssertions;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests;

[TestClass]
public class SystemAccessorTests : AccessorTestBase
{
    [TestMethod]
    public async Task LoadFilters_WaterRightsControlledVocabularies_ShouldBeAlphabeticalAndDistinct()
    {
        // Arrange
        var db = CreateDatabaseContextFactory().Create();
        var filters = new[]
        {
            new FilterEntry { FilterType = "WaterRightAllocationTypes", WaDeName = "Claim" },
            new FilterEntry { FilterType = "WaterRightAllocationTypes", WaDeName = "Permit" },

            new FilterEntry { FilterType = "WaterRightLegalStatuses", WaDeName = "Active" },
            new FilterEntry { FilterType = "WaterRightLegalStatuses", WaDeName = "Pending" },

            new FilterEntry { FilterType = "WaterRightOwnerClassifications", WaDeName = "Private" },
            new FilterEntry { FilterType = "WaterRightOwnerClassifications", WaDeName = "Military" },

            new FilterEntry { FilterType = "WaterRightSiteTypes", WaDeName = "Well" },
            new FilterEntry { FilterType = "WaterRightSiteTypes", WaDeName = "Canal" },

            new FilterEntry { FilterType = "WaterRightStates", WaDeName = "UT" },
            new FilterEntry { FilterType = "WaterRightStates", WaDeName = "CO" },

            new FilterEntry { FilterType = "WaterRightWaterSources", WaDeName = "Surface Water" },
            new FilterEntry { FilterType = "WaterRightWaterSources", WaDeName = "Groundwater" }
        };

        db.Filters.AddRange(filters);
        await db.SaveChangesAsync();

        var accessor = CreateSystemAccessor();

        // Act
        var result = await accessor.LoadFilters();
        var waterRights = result.WaterRights;

        // Assert
        waterRights.AllocationTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        waterRights.LegalStatuses.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        waterRights.OwnerClassifications.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        waterRights.SiteTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        waterRights.States.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
        waterRights.WaterSourceTypes.Should().BeInAscendingOrder().And.OnlyHaveUniqueItems();
    }

    [TestMethod]
    public async Task LoadFilters_BeneficialUses_ShouldBeSortedAndDistinct()
    {
        // Arrange
        var db = CreateDatabaseContextFactory().Create();

        var uses = new[]
        {
            new BeneficialUsesCVFaker()
                .RuleFor(x => x.Name, "AgricultureIrrigation")
                .RuleFor(x => x.WaDEName, "Agriculture Irrigation")
                .RuleFor(x => x.ConsumptionCategoryType, Common.ConsumptionCategory.Consumptive)
                .Generate(),

            new BeneficialUsesCVFaker()
                .RuleFor(x => x.Name, "Livestock")
                .RuleFor(x => x.WaDEName, "Livestock")
                .RuleFor(x => x.ConsumptionCategoryType, Common.ConsumptionCategory.Consumptive)
                .Generate()
        };

        var allocation = new AllocationAmountFactFaker().Generate();
        db.AllocationAmountsFact.Add(allocation);

        var bridge = new AllocationBridgeBeneficialUsesFactFaker()
            .RuleFor(x => x.AllocationAmount, _ => allocation) 
            .RuleFor(x => x.BeneficialUseCV, uses[0].Name)
            .Generate();


        db.BeneficialUsesCV.AddRange(uses);
        db.AllocationBridgeBeneficialUsesFact.Add(bridge);

        await db.SaveChangesAsync();

        var accessor = CreateSystemAccessor();

        // Act
        var result = await accessor.LoadFilters();
        var buItems = result.WaterRights.BeneficialUses;

        // Assert
        buItems.Should().ContainSingle(x => x.BeneficialUseName == "Agriculture Irrigation");
        buItems.Should().OnlyHaveUniqueItems(b => b.BeneficialUseName);
        buItems.Select(x => x.BeneficialUseName).Should().BeInAscendingOrder();
    }

    private ISystemAccessor CreateSystemAccessor()
    {
        return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
    }
}
