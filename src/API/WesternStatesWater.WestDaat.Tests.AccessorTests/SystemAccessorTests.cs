using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using FluentAssertions;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests
{
    [TestClass]
    public class SystemAccessorTests : AccessorTestBase
    {
        [TestMethod]
        public async Task LoadFilters_ShouldReturnOnlyUsedControlledVocabularies()
        {
            // Arrange
            await using var db = CreateDatabaseContextFactory().Create();

            // WaterRights Data
            db.AllocationAmountsView.Add(new AllocationAmountsView
            {
                AllocationType = "RightType1",
                OwnerClassifications = "Public||Private",
                LegalStatus = "Active",
                SiteType = "Well",
                WaterSources = "Groundwater",
                States = "CA||NV"
            });

            db.BeneficialUsesCV.AddRange(
                new BeneficialUsesCV { Name = "Irrigation", WaDEName = "Irrigation", ConsumptionCategoryType = Common.ConsumptionCategory.Consumptive },
                new BeneficialUsesCV { Name = "Livestock", WaDEName = "Livestock", ConsumptionCategoryType = Common.ConsumptionCategory.Consumptive }
            );

            db.AllocationBridgeBeneficialUsesFact.AddRange(
                new AllocationBridgeBeneficialUsesFact { BeneficialUseCV = "Irrigation" },
                new AllocationBridgeBeneficialUsesFact { BeneficialUseCV = "Livestock" }
            );

            // Overlays Data
            db.OverlaysViews.Add(new OverlaysView
            {
                OverlayTypeWaDEName = "OverlayType1",
                WaterSourceTypeWaDEName = "Surface Water",
                State = "UT"
            });

            // TimeSeries Data
            var site = new SitesDim
            {
                SiteUuid = Guid.NewGuid().ToString(),
                StateCv = "CO",
                SiteTypeCvNavigation = new SiteType { WaDEName = "Stream" }
            };

            var primaryBeneficialUse = new BeneficialUsesCV { WaDEName = "Municipal" };

            var variableSpecific = new VariableSpecific
            {
                Name = "Flow"
            };

            var variablesDim = new VariablesDim
            {
                VariableSpecificCvNavigation = variableSpecific,
                VariableCvNavigation = new Variable { WaDEName = "Flow" }
            };

            var waterSourceType = new WaterSourceType { WaDEName = "Surface Water" };

            var waterSourceDim = new WaterSourcesDim
            {
                WaterSourceUuid = Guid.NewGuid().ToString(),
                WaterSourceName = "Some Water Source",
                WaterSourceNativeId = "NativeId",
                WaterSourceTypeCvNavigation = waterSourceType
            };

            var startDate = new DateDim { Date = DateTime.UtcNow.AddYears(-1) };
            var endDate = new DateDim { Date = DateTime.UtcNow };

            db.VariableSpecific.Add(variableSpecific);
            db.VariablesDim.Add(variablesDim);
            db.WaterSourceType.Add(waterSourceType);
            db.WaterSourcesDim.Add(waterSourceDim);
            db.SitesDim.Add(site);
            db.BeneficialUsesCV.Add(primaryBeneficialUse);
            db.DateDim.AddRange(startDate, endDate);

            db.SiteVariableAmountsFact.Add(new SiteVariableAmountsFact
            {
                OrganizationId = 1,
                Site = site,
                VariableSpecific = variablesDim,
                WaterSource = waterSourceDim,
                MethodId = 1,
                TimeframeStartNavigation = startDate,
                TimeframeEndNavigation = endDate,
                DataPublicationDateNavigation = new DateDim { Date = DateTime.UtcNow },
                DataPublicationDoi = "doi:dummy",
                ReportYearCv = "2024",
                Amount = 123.45,
                PrimaryBeneficialUse = primaryBeneficialUse
            });

            await db.SaveChangesAsync();

            var accessor = CreateSystemAccessor();

            // Act
            var filters = await accessor.LoadFilters();

            // Assert
            filters.Overlays.OverlayTypes.Should().BeEquivalentTo(["OverlayType1"]);
            filters.Overlays.WaterSourceTypes.Should().BeEquivalentTo(["Surface Water"]);
            filters.Overlays.States.Should().BeEquivalentTo(["UT"]);

            filters.WaterRights.BeneficialUses.Select(b => b.BeneficialUseName).Should().BeEquivalentTo(["Irrigation", "Livestock"]);
            filters.WaterRights.AllocationTypes.Should().BeEquivalentTo(["RightType1"]);
            filters.WaterRights.OwnerClassifications.Should().BeEquivalentTo(["Private", "Public"]);
            filters.WaterRights.LegalStatuses.Should().BeEquivalentTo(["Active"]);
            filters.WaterRights.SiteTypes.Should().BeEquivalentTo(["Well"]);
            filters.WaterRights.WaterSourceTypes.Should().BeEquivalentTo(["Groundwater"]);
            filters.WaterRights.States.Should().BeEquivalentTo(["CA", "NV"]);
            filters.WaterRights.RiverBasins.Should().NotBeEmpty();

            filters.TimeSeries.SiteTypes.Should().BeEquivalentTo(["Stream"]);
            filters.TimeSeries.PrimaryUseCategories.Should().BeEquivalentTo(["Municipal"]);
            filters.TimeSeries.VariableTypes.Should().BeEquivalentTo(["Flow"]);
            filters.TimeSeries.WaterSourceTypes.Should().BeEquivalentTo(["Surface Water"]);
            filters.TimeSeries.States.Should().BeEquivalentTo(["CO"]);
        }

        private ISystemAccessor CreateSystemAccessor()
        {
            return new SystemAccessor(CreateLogger<SystemAccessor>(), CreateDatabaseContextFactory());
        }
    }
}
