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
        
        private static string[] Get(string key, Dictionary<string, string[]> lookup)
        {
            if (lookup.TryGetValue(key, out var arr))
            {
                return arr;
            }
            return Array.Empty<string>();
        }

        public async Task<DashboardFilters> LoadFilters()
        {
            await using var db = _databaseContextFactory.Create();
            var lookup = await db.Filters
                .AsNoTracking()
                .GroupBy(f => f.FilterType)
                .ToDictionaryAsync(
                    g => g.Key,
                    g => g.Select(f => f.WaDeName.Trim())
                          .Distinct()
                          .OrderBy(name => name)
                          .ToArray()
                );

            var overlayTypes = Get(FilterTypeConstants.OverlayTypes, lookup);
            var overlayWaterSources = Get(FilterTypeConstants.OverlayWaterSources, lookup);
            var overlayStates = Get(FilterTypeConstants.OverlayStates, lookup);

            var ownerClassifications = Get(FilterTypeConstants.WaterRightOwnerClassifications, lookup);
            var allocationTypes = Get(FilterTypeConstants.WaterRightAllocationTypes, lookup);
            var legalStatuses = Get(FilterTypeConstants.WaterRightLegalStatuses, lookup);
            var siteTypes = Get(FilterTypeConstants.WaterRightSiteTypes, lookup);
            var waterSources = Get(FilterTypeConstants.WaterRightWaterSources, lookup);
            var wrStates = Get(FilterTypeConstants.WaterRightStates, lookup);

            var tsSiteTypes = Get(FilterTypeConstants.TimeSeriesSiteTypes, lookup);
            var tsPrimaryUses = Get(FilterTypeConstants.TimeSeriesPrimaryUses, lookup);
            var tsVariableTypes = Get(FilterTypeConstants.TimeSeriesVariableTypes, lookup);
            var tsWaterSources = Get(FilterTypeConstants.TimeSeriesWaterSources, lookup);
            var tsStates = Get(FilterTypeConstants.TimeSeriesStates, lookup);


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
