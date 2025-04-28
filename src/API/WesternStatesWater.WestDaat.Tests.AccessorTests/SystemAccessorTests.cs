using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Tests.Helpers;

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

            // WaterRights data
            var beneficialUses = new[]
            {
                new BeneficialUsesCV { Name = "Irrigation", WaDEName = "Irrigation", ConsumptionCategoryType = Common.ConsumptionCategory.Consumptive },
                new BeneficialUsesCV { Name = "Livestock", WaDEName = "Livestock", ConsumptionCategoryType = Common.ConsumptionCategory.Consumptive }
            };

            var waterSourceType = new WaterSourceType { WaDEName = "Groundwater" };
            var siteType = new SiteType { WaDEName = "Well" };

            var waterSource = new WaterSourceDimFaker()
                .RuleFor(w => w.WaterSourceTypeCvNavigation, _ => waterSourceType)
                .Generate();

            var site = new SitesDim
            {
                SiteUuid = Guid.NewGuid().ToString(),
                SiteTypeCvNavigation = siteType,
                StateCv = "CA"
            };

            var allocation = new AllocationAmountsFact
            {
                AllocationTypeCv = "RightType1",
            };

            db.BeneficialUsesCV.AddRange(beneficialUses);
            db.SitesDim.Add(site);
            db.WaterSourcesDim.Add(waterSource);
            db.AllocationAmountsFact.Add(allocation);

            db.AllocationBridgeBeneficialUsesFact.AddRange(
                new AllocationBridgeBeneficialUsesFact { BeneficialUseCV = "Irrigation" },
                new AllocationBridgeBeneficialUsesFact { BeneficialUseCV = "Livestock" }
            );

            // Overlays data
            db.OverlaysViews.Add(new OverlaysView
            {
                OverlayTypeWaDEName = "OverlayType1",
                WaterSourceTypeWaDEName = "Surface Water",
                State = "UT"
            });

            // TimeSeries data
            var variable = new Variable { WaDEName = "Flow" };
            var variableSpecific = new VariableSpecific();
            var variablesDim = new VariablesDim
            {
                VariableSpecificCvNavigation = variableSpecific,
                VariableCvNavigation = variable
            };

            var tsSite = new SitesDim
            {
                SiteUuid = Guid.NewGuid().ToString(),
                StateCv = "CO",
                SiteTypeCvNavigation = new SiteType { WaDEName = "Stream" }
            };

            var tsWaterSource = new WaterSourceDimFaker()
                .RuleFor(w => w.WaterSourceTypeCvNavigation, _ => new WaterSourceType { WaDEName = "Surface Water" })
                .Generate();

            var tsBeneficialUse = new BeneficialUsesCV { WaDEName = "Municipal" };

            var startDate = new DateDim { Date = DateTime.UtcNow.AddYears(-1) };
            var endDate = new DateDim { Date = DateTime.UtcNow };

            db.Variable.Add(variable);
            db.VariableSpecific.Add(variableSpecific);
            db.VariablesDim.Add(variablesDim);
            db.SitesDim.Add(tsSite);
            db.WaterSourcesDim.Add(tsWaterSource);
            db.BeneficialUsesCV.Add(tsBeneficialUse);
            db.DateDim.AddRange(startDate, endDate);

            db.SiteVariableAmountsFact.Add(new SiteVariableAmountsFact
            {
                OrganizationId = 1,
                Site = tsSite,
                VariableSpecific = variablesDim,
                WaterSource = tsWaterSource,
                MethodId = 1,
                TimeframeStartNavigation = startDate,
                TimeframeEndNavigation = endDate,
                DataPublicationDateNavigation = new DateDim { Date = DateTime.UtcNow },
                DataPublicationDoi = "doi:dummy",
                ReportYearCv = "2024",
                Amount = 123.45,
                PrimaryBeneficialUse = tsBeneficialUse
            });

            await db.SaveChangesAsync();

            var accessor = CreateSystemAccessor();

            // Act
            var filters = await accessor.LoadFilters();

            // Assert
            filters.Overlays.OverlayTypes.Should().BeEquivalentTo(["OverlayType1"]);
            filters.Overlays.WaterSourceTypes.Should().BeEquivalentTo(["Surface Water"]);
            filters.Overlays.States.Should().BeEquivalentTo(["UT"]);

            filters.WaterRights.BeneficialUses.Select(b => b.BeneficialUseName)
                .Should().BeEquivalentTo(["Irrigation", "Livestock"]);
            filters.WaterRights.AllocationTypes.Should().BeEquivalentTo(["RightType1"]);
            filters.WaterRights.OwnerClassifications.Should().BeEquivalentTo(["Public"]);
            filters.WaterRights.LegalStatuses.Should().BeEquivalentTo(["Active"]);
            filters.WaterRights.SiteTypes.Should().BeEquivalentTo(["Well"]);
            filters.WaterRights.WaterSourceTypes.Should().BeEquivalentTo(["Groundwater"]);
            filters.WaterRights.States.Should().BeEquivalentTo(["CA"]);
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
