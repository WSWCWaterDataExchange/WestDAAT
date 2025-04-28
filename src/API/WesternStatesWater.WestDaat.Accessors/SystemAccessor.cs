using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Extensions;
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

        async Task<DashboardFilters> ISystemAccessor.LoadFilters()
        {
            await using var db = _databaseContextFactory.Create();

            // Overlays
            var overlayTypes = await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.OverlayTypeWaDEName))
                .Select(x => x.OverlayTypeWaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var overlayWaterSources = await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.WaterSourceTypeWaDEName))
                .Select(x => x.WaterSourceTypeWaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var overlayStatesRaw = await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.State))
                .Select(x => x.State)
                .Distinct()
                .ToArrayAsync();
            var overlayStates = SplitAndDistinct(overlayStatesRaw);

            // Water Rights (Allocations)
            var beneficialUses = await GetBeneficialUseItems(db);

            var ownerClassificationsRaw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.OwnerClassifications))
                .Select(x => x.OwnerClassifications)
                .Distinct()
                .ToArrayAsync();
            var ownerClassifications = SplitAndDistinct(ownerClassificationsRaw);

            var allocationTypes = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.AllocationType))
                .Select(x => x.AllocationType)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var legalStatusesRaw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.LegalStatus))
                .Select(x => x.LegalStatus)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
            var legalStatuses = SplitAndDistinct(legalStatusesRaw);

            var siteTypesRaw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.SiteType))
                .Select(x => x.SiteType)
                .Distinct()
                .ToArrayAsync();
            var siteTypes = SplitAndDistinct(siteTypesRaw);

            var waterSourcesRaw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.WaterSources))
                .Select(x => x.WaterSources)
                .Distinct()
                .ToArrayAsync();
            var waterSources = SplitAndDistinct(waterSourcesRaw);

            var wrStatesRaw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.States))
                .Select(x => x.States)
                .Distinct()
                .ToArrayAsync();
            var wrStates = SplitAndDistinct(wrStatesRaw);

            var riverBasins = RiverBasinConstants.RiverBasinNames.ToArray();

            // Time Series
            var tsSiteTypes = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.Site.SiteTypeCvNavigation != null)
                .Select(x => x.Site.SiteTypeCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var tsPrimaryUses = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.PrimaryBeneficialUse != null)
                .Select(x => x.PrimaryBeneficialUse.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var tsVariableTypes = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.VariableSpecific != null)
                .Select(x => x.VariableSpecific.VariableCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var tsWaterSources = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.WaterSource != null && x.WaterSource.WaterSourceTypeCvNavigation != null)
                .Select(x => x.WaterSource.WaterSourceTypeCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();

            var tsStatesRaw = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.Site.StateCv))
                .Select(x => x.Site.StateCv)
                .Distinct()
                .ToArrayAsync();
            var tsStates = SplitAndDistinct(tsStatesRaw);

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
                    RiverBasins = riverBasins
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

        private static async Task<BeneficialUseItem[]> GetBeneficialUseItems(EF.DatabaseContext db)
        {
            var rawUses = await db.BeneficialUsesCV
                .AsNoTracking()
                .Where(cv => db.AllocationBridgeBeneficialUsesFact.Any(b => b.BeneficialUseCV == cv.Name)
                          || db.SitesBridgeBeneficialUsesFact.Any(s => s.BeneficialUseCV == cv.Name))
                .Select(cv => new
                {
                    Name = cv.WaDEName.Length > 0 ? cv.WaDEName : cv.Name,
                    Category = cv.ConsumptionCategoryType != null
                        ? cv.ConsumptionCategoryType.ToString()
                        : Common.ConsumptionCategory.Unspecified.ToString()
                })
                .ToListAsync();

            return rawUses
                .GroupBy(x => x.Name)
                .Select(g => new BeneficialUseItem
                {
                    BeneficialUseName = g.Key,
                    ConsumptionCategory = g.Max(x => Enum.TryParse<Common.ConsumptionCategory>(x.Category, out var category) ? category : Common.ConsumptionCategory.Unspecified)
                })
                .OrderBy(x => x.BeneficialUseName)
                .ToArray();
        }

        private static string[] SplitAndDistinct(string[] rawValues)
        {
            return rawValues?
                .Where(x => !string.IsNullOrEmpty(x))
                .SelectMany(x => x.Split("||", StringSplitOptions.RemoveEmptyEntries))
                .Distinct()
                .OrderBy(x => x)
                .ToArray()
                ?? Array.Empty<string>();
        }
    }
}
