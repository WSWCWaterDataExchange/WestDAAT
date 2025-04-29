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

        async Task<DashboardFilters> ISystemAccessor.LoadFilters()
        {
            var overlayTypesTask = GetOverlayTypes();
            var overlayWaterSourcesTask = GetOverlayWaterSources();
            var overlayStatesTask = GetOverlayStates();
            var beneficialUsesTask = GetBeneficialUses();
            var ownerClassificationsTask = GetOwnerClassifications();
            var allocationTypesTask = GetAllocationTypes();
            var legalStatusesTask = GetLegalStatuses();
            var siteTypesTask = GetSiteTypes();
            var waterSourcesTask = GetWaterSources();
            var wrStatesTask = GetWrStates();
            var tsSiteTypesTask = GetTsSiteTypes();
            var tsPrimaryUsesTask = GetTsPrimaryUses();
            var tsVariableTypesTask = GetTsVariableTypes();
            var tsWaterSourcesTask = GetTsWaterSources();
            var tsStatesTask = GetTsStates();

            await Task.WhenAll(
                overlayTypesTask,
                overlayWaterSourcesTask,
                overlayStatesTask,
                beneficialUsesTask,
                ownerClassificationsTask,
                allocationTypesTask,
                legalStatusesTask,
                siteTypesTask,
                waterSourcesTask,
                wrStatesTask,
                tsSiteTypesTask,
                tsPrimaryUsesTask,
                tsVariableTypesTask,
                tsWaterSourcesTask,
                tsStatesTask
            );

            return new DashboardFilters
            {
                Overlays = new OverlayFilterSet
                {
                    OverlayTypes = overlayTypesTask.Result,
                    WaterSourceTypes = overlayWaterSourcesTask.Result,
                    States = overlayStatesTask.Result
                },
                WaterRights = new WaterRightsFilterSet
                {
                    BeneficialUses = beneficialUsesTask.Result,
                    OwnerClassifications = ownerClassificationsTask.Result,
                    AllocationTypes = allocationTypesTask.Result,
                    LegalStatuses = legalStatusesTask.Result,
                    SiteTypes = siteTypesTask.Result,
                    WaterSourceTypes = waterSourcesTask.Result,
                    States = wrStatesTask.Result,
                    RiverBasins = RiverBasinConstants.RiverBasinNames.ToArray()
                },
                TimeSeries = new TimeSeriesFilterSet
                {
                    SiteTypes = tsSiteTypesTask.Result,
                    PrimaryUseCategories = tsPrimaryUsesTask.Result,
                    VariableTypes = tsVariableTypesTask.Result,
                    WaterSourceTypes = tsWaterSourcesTask.Result,
                    States = tsStatesTask.Result
                }
            };
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

        private async Task<string[]> GetOverlayTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.OverlayTypeWaDEName))
                .Select(x => x.OverlayTypeWaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetOverlayWaterSources()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.WaterSourceTypeWaDEName))
                .Select(x => x.WaterSourceTypeWaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetOverlayStates()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.OverlaysViews
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.State))
                .Select(x => x.State)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
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
                    ConsumptionCategory = g.Max(x =>
                        Enum.TryParse<Common.ConsumptionCategory>(x.Category, out var category)
                            ? category
                            : Common.ConsumptionCategory.Unspecified)
                })
                .OrderBy(x => x.BeneficialUseName)
                .ToArray();
        }

        private async Task<string[]> GetOwnerClassifications()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.OwnerClassifications))
                .Select(x => x.OwnerClassifications)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetAllocationTypes()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.AllocationType))
                .Select(x => x.AllocationType)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetLegalStatuses()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.LegalStatus))
                .Select(x => x.LegalStatus)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetSiteTypes()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.SiteType))
                .Select(x => x.SiteType)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetWaterSources()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.WaterSources))
                .Select(x => x.WaterSources)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetWrStates()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.AllocationAmountsView
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.States))
                .Select(x => x.States)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }

        private async Task<string[]> GetTsSiteTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.Site.SiteTypeCvNavigation != null)
                .Select(x => x.Site.SiteTypeCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetTsPrimaryUses()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.PrimaryBeneficialUse != null)
                .Select(x => x.PrimaryBeneficialUse.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetTsVariableTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.VariableSpecific != null)
                .Select(x => x.VariableSpecific.VariableCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetTsWaterSources()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => x.WaterSource != null && x.WaterSource.WaterSourceTypeCvNavigation != null)
                .Select(x => x.WaterSource.WaterSourceTypeCvNavigation.WaDEName)
                .Distinct()
                .OrderBy(x => x)
                .ToArrayAsync();
        }

        private async Task<string[]> GetTsStates()
        {
            await using var db = _databaseContextFactory.Create();
            var raw = await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Where(x => !string.IsNullOrEmpty(x.Site.StateCv))
                .Select(x => x.Site.StateCv)
                .Distinct()
                .ToArrayAsync();
            return SplitAndDistinct(raw);
        }
    }
}
