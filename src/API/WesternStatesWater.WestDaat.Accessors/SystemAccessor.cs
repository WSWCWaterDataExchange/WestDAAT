using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
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

        async Task<DashboardFilters> ISystemAccessor.LoadFilters()
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


            var beneficialUses = await GetBeneficialUses(db);

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
        
        private static Task<BeneficialUseItem[]> GetBeneficialUses(EF.DatabaseContext db)
        {
            return db.BeneficialUsesCV
                .ProjectTo<BeneficialUseItem>(DtoMapper.Configuration)
                .Distinct()
                .OrderBy(a => a.BeneficialUseName)
                .GroupBy(a => a.BeneficialUseName)
                .Select(g => g.OrderBy(c => c.ConsumptionCategory).LastOrDefault())
                .ToArrayAsync();
        }
    }
}
