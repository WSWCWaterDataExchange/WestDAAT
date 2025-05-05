using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SystemAccessor : AccessorBase, ISystemAccessor
    {
        private readonly EF.IDatabaseContextFactory _databaseContextFactory;

        public SystemAccessor(ILogger<SystemAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory)
            : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        public async Task<DashboardFilters> LoadFilters()
        {
            var overlayTypes = await GetFilterValues("OverlayTypes");
            var overlayWaterSources = await GetFilterValues("OverlayWaterSources");
            var overlayStates = await GetFilterValues("OverlayStates");

            var beneficialUses = await GetBeneficialUses();
            var ownerClassifications = await GetFilterValues("WaterRightOwnerClassifications");
            var allocationTypes = await GetFilterValues("WaterRightAllocationTypes");
            var legalStatuses = await GetFilterValues("WaterRightLegalStatuses");
            var siteTypes = await GetFilterValues("WaterRightSiteTypes");
            var waterSources = await GetFilterValues("WaterRightWaterSources");
            var wrStates = await GetFilterValues("WaterRightStates");

            var tsSiteTypes = await GetFilterValues("TimeSeriesSiteTypes");
            var tsPrimaryUses = await GetFilterValues("TimeSeriesPrimaryUses");
            var tsVariableTypes = await GetFilterValues("TimeSeriesVariableTypes");
            var tsWaterSources = await GetFilterValues("TimeSeriesWaterSources");
            var tsStates = await GetFilterValues("TimeSeriesStates");

            return new DashboardFilters
            {
                Overlays = new OverlayFilterSet
                {
                    OverlayTypes = overlayTypes,
                    WaterSourceTypes = overlayWaterSources,
                    States = overlayStates
                },
                WaterRights = new WaterRightsFilterSet
                {
                    BeneficialUses = beneficialUses,
                    OwnerClassifications = ownerClassifications,
                    AllocationTypes = allocationTypes,
                    LegalStatuses = legalStatuses,
                    SiteTypes = siteTypes,
                    WaterSourceTypes = waterSources,
                    States = wrStates,
                    RiverBasins = RiverBasinConstants.RiverBasinNames.ToArray()
                },
                TimeSeries = new TimeSeriesFilterSet
                {
                    SiteTypes = tsSiteTypes,
                    PrimaryUseCategories = tsPrimaryUses,
                    VariableTypes = tsVariableTypes,
                    WaterSourceTypes = tsWaterSources,
                    States = tsStates
                }
            };
        }

        private async Task<string[]> GetFilterValues(string filterType)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.Filters
                .AsNoTracking()
                .Where(f => f.FilterType == filterType && !string.IsNullOrWhiteSpace(f.WaDeName))
                .Select(f => f.WaDeName.Trim())
                .Distinct()
                .OrderBy(f => f)
                .ToArrayAsync();
        }

        private async Task<BeneficialUseItem[]> GetBeneficialUses()
        {
            await using var db = _databaseContextFactory.Create();
            var rawUses = await db.BeneficialUsesCV
                .AsNoTracking()
                .Where(cv =>
                    db.AllocationBridgeBeneficialUsesFact.Any(b => b.BeneficialUseCV == cv.Name) ||
                    db.SitesBridgeBeneficialUsesFact.Any(s => s.BeneficialUseCV == cv.Name))
                .Select(cv => new
                {
                    Name = !string.IsNullOrWhiteSpace(cv.WaDEName) ? cv.WaDEName : cv.Name,
                    Category = cv.ConsumptionCategoryType.ToString()
                        ?? Common.ConsumptionCategory.Unspecified.ToString()
                })
                .ToListAsync();

            return rawUses
                .GroupBy(x => x.Name)
                .Select(g => new BeneficialUseItem
                {
                    BeneficialUseName = g.Key,
                    ConsumptionCategory = g.Max(x =>
                        Enum.TryParse<Common.ConsumptionCategory>(x.Category, out var category)
                            ? category
                            : Common.ConsumptionCategory.Unspecified)
                })
                .OrderBy(x => x.BeneficialUseName)
                .ToArray();
        }
    }
}
