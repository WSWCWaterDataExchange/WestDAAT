using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SystemAccessor : AccessorBase, ISystemAccessor
    {
        private readonly EF.IDatabaseContextFactory _databaseContextFactory;

        public SystemAccessor(
            ILogger<SystemAccessor> logger,
            EF.IDatabaseContextFactory databaseContextFactory)
            : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        public async Task<DashboardFilters> LoadFilters()
        {
            var filterTypes = new[]
            {
                FilterTypeConstants.OverlayTypes,
                FilterTypeConstants.OverlayWaterSources,
                FilterTypeConstants.OverlayStates,
                FilterTypeConstants.WaterRightOwnerClassifications,
                FilterTypeConstants.WaterRightAllocationTypes,
                FilterTypeConstants.WaterRightLegalStatuses,
                FilterTypeConstants.WaterRightSiteTypes,
                FilterTypeConstants.WaterRightWaterSources,
                FilterTypeConstants.WaterRightStates,
                FilterTypeConstants.TimeSeriesSiteTypes,
                FilterTypeConstants.TimeSeriesPrimaryUses,
                FilterTypeConstants.TimeSeriesVariableTypes,
                FilterTypeConstants.TimeSeriesWaterSources,
                FilterTypeConstants.TimeSeriesStates
            };

            await using var db = _databaseContextFactory.Create();
            var rawFilters = await db.Filters
                .AsNoTracking()
                .Where(f => filterTypes.Contains(f.FilterType)
                            && !string.IsNullOrWhiteSpace(f.WaDeName))
                .Select(f => new
                {
                    f.FilterType,
                    Name = f.WaDeName.Trim()
                })
                .Distinct()
                .ToListAsync();

            var lookup = rawFilters
                .GroupBy(x => x.FilterType)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Name)
                          .OrderBy(n => n)
                          .ToArray());

            string[] Get(string key) =>
                lookup.TryGetValue(key, out var arr)
                    ? arr
                    : Array.Empty<string>();

            var overlayTypes = Get(FilterTypeConstants.OverlayTypes);
            var overlayWaterSources = Get(FilterTypeConstants.OverlayWaterSources);
            var overlayStates = Get(FilterTypeConstants.OverlayStates);

            var ownerClassifications = Get(FilterTypeConstants.WaterRightOwnerClassifications);
            var allocationTypes = Get(FilterTypeConstants.WaterRightAllocationTypes);
            var legalStatuses = Get(FilterTypeConstants.WaterRightLegalStatuses);
            var siteTypes = Get(FilterTypeConstants.WaterRightSiteTypes);
            var waterSources = Get(FilterTypeConstants.WaterRightWaterSources);
            var wrStates = Get(FilterTypeConstants.WaterRightStates);

            var tsSiteTypes = Get(FilterTypeConstants.TimeSeriesSiteTypes);
            var tsPrimaryUses = Get(FilterTypeConstants.TimeSeriesPrimaryUses);
            var tsVariableTypes = Get(FilterTypeConstants.TimeSeriesVariableTypes);
            var tsWaterSources = Get(FilterTypeConstants.TimeSeriesWaterSources);
            var tsStates = Get(FilterTypeConstants.TimeSeriesStates);


            var beneficialUses = await GetBeneficialUses();

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
                        Enum.TryParse<Common.ConsumptionCategory>(x.Category, out var cat)
                            ? cat
                            : Common.ConsumptionCategory.Unspecified)
                })
                .OrderBy(x => x.BeneficialUseName)
                .ToArray();
        }
    }
}
