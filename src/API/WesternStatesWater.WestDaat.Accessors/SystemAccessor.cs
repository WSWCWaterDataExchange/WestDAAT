using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;
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
            var results = new ConcurrentDictionary<string, object>();
            var factories = new List<(string Key, Func<Task<object>> Factory)>
            {
                ("OverlayTypes", async () => await GetOverlayTypes()),
                ("OverlayWaterSources", async () => await GetOverlayWaterSources()),
                ("OverlayStates", async () => await GetOverlayStates()),
                ("BeneficialUses", async () => await GetBeneficialUses()),
                ("OwnerClassifications", async () => await GetOwnerClassifications()),
                ("AllocationTypes", async () => await GetAllocationTypes()),
                ("LegalStatuses", async () => await GetLegalStatuses()),
                ("SiteTypes", async () => await GetSiteTypes()),
                ("WaterSources", async () => await GetWaterSources()),
                ("WrStates", async () => await GetWrStates()),
                ("TsSiteTypes", async () => await GetTsSiteTypes()),
                ("TsPrimaryUses", async () => await GetTsPrimaryUses()),
                ("TsVariableTypes", async () => await GetTsVariableTypes()),
                ("TsWaterSources", async () => await GetTsWaterSources()),
                ("TsStates", async () => await GetTsStates())
            };

            async ValueTask ProcessFactory((string Key, Func<Task<object>> Factory) item, CancellationToken ct)
            {
                results[item.Key] = await item.Factory();
            }

            await Parallel.ForEachAsync(
                factories,
                new ParallelOptions { CancellationToken = CancellationToken.None },
                ProcessFactory
            );

            return new DashboardFilters
            {
                Overlays = new OverlayFilterSet
                {
                    OverlayTypes = (string[])results["OverlayTypes"],
                    WaterSourceTypes = (string[])results["OverlayWaterSources"],
                    States = (string[])results["OverlayStates"]
                },
                WaterRights = new WaterRightsFilterSet
                {
                    BeneficialUses = (BeneficialUseItem[])results["BeneficialUses"],
                    OwnerClassifications = (string[])results["OwnerClassifications"],
                    AllocationTypes = (string[])results["AllocationTypes"],
                    LegalStatuses = (string[])results["LegalStatuses"],
                    SiteTypes = (string[])results["SiteTypes"],
                    WaterSourceTypes = (string[])results["WaterSources"],
                    States = (string[])results["WrStates"],
                    RiverBasins = RiverBasinConstants.RiverBasinNames.ToArray()
                },
                TimeSeries = new TimeSeriesFilterSet
                {
                    SiteTypes = (string[])results["TsSiteTypes"],
                    PrimaryUseCategories = (string[])results["TsPrimaryUses"],
                    VariableTypes = (string[])results["TsVariableTypes"],
                    WaterSourceTypes = (string[])results["TsWaterSources"],
                    States = (string[])results["TsStates"]
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
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetOverlayWaterSources()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetOverlayStates()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<BeneficialUseItem[]> GetBeneficialUses()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetOwnerClassifications()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetAllocationTypes()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetLegalStatuses()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetSiteTypes()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetWaterSources()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetWrStates()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetTsSiteTypes()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetTsPrimaryUses()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetTsVariableTypes()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetTsWaterSources()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
        }

        private async Task<string[]> GetTsStates()
        {
            using (new TransactionScope(TransactionScopeOption.Suppress, TransactionScopeAsyncFlowOption.Enabled))
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
}