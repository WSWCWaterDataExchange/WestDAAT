using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WaDE.Database.EntityFramework;

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
            // Define tasks with separate DbContext instances
            async Task<string[]> GetOverlayTypes()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.OverlaysViews
                    .AsNoTracking()
                    .Select(o => o.OverlayTypeWaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetOverlayWaterSources()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.OverlaysViews
                    .AsNoTracking()
                    .Select(o => o.WaterSourceTypeWaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetOverlayStates()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.OverlaysViews
                    .AsNoTracking()
                    .Select(o => o.State)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<List<(string Name, string Category)>> GetBeneficialUses()
            {
                await using var db = _databaseContextFactory.Create();
                var results = await db.BeneficialUsesCV
                    .AsNoTracking()
                    .Where(cv => db.AllocationBridgeBeneficialUsesFact.Any(b => b.BeneficialUseCV == cv.Name)
                              || db.SitesBridgeBeneficialUsesFact.Any(s => s.BeneficialUseCV == cv.Name))
                    .Select(cv => new
                    {
                        Name = cv.WaDEName,
                        Category = cv.ConsumptionCategoryType != null ? cv.ConsumptionCategoryType.ToString() : Common.ConsumptionCategory.Unspecified.ToString()
                    })
                    .ToListAsync();
                return results.Select(x => (x.Name, x.Category)).ToList();
            }

            async Task<string[]> GetOwnerClassifications()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.OwnerClassifications)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetAllocationTypes()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.AllocationType)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetLegalStatuses()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.LegalStatus)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetSiteTypes()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.SiteType)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetWaterSources()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.WaterSources)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetWrStates()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.AllocationAmountsView
                    .AsNoTracking()
                    .Select(a => a.States)
                    .Distinct()
                    .ToArrayAsync();
            }

            async Task<string[]> GetTsSiteTypes()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .Select(f => f.Site.SiteTypeCvNavigation.WaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetTsPrimaryUses()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .Select(f => f.PrimaryBeneficialUse.WaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetTsVariableTypes()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .Select(f => f.VariableSpecific.VariableCvNavigation.WaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetTsWaterSources()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .Select(f => f.WaterSource.WaterSourceTypeCvNavigation.WaDEName)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            async Task<string[]> GetTsStates()
            {
                await using var db = _databaseContextFactory.Create();
                return await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .Select(f => f.Site.StateCv)
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArrayAsync();
            }

            // Run all tasks concurrently using a list
            var tasks = new List<Task>
            {
                GetOverlayTypes(),
                GetOverlayWaterSources(),
                GetOverlayStates(),
                GetBeneficialUses(),
                GetOwnerClassifications(),
                GetAllocationTypes(),
                GetLegalStatuses(),
                GetSiteTypes(),
                GetWaterSources(),
                GetWrStates(),
                GetTsSiteTypes(),
                GetTsPrimaryUses(),
                GetTsVariableTypes(),
                GetTsWaterSources(),
                GetTsStates()
            };

            await Task.WhenAll(tasks);

            // Process results
            var overlayTypes = await (Task<string[]>)tasks[0];
            var overlayWaterSources = await (Task<string[]>)tasks[1];
            var overlayStates = await (Task<string[]>)tasks[2];
            var rawUses = await (Task<List<(string Name, string Category)>>)tasks[3];
            var ownerClassesRaw = await (Task<string[]>)tasks[4];
            var allocationTypesRaw = await (Task<string[]>)tasks[5];
            var legalStatusesRaw = await (Task<string[]>)tasks[6];
            var siteTypesRaw = await (Task<string[]>)tasks[7];
            var waterSourcesRaw = await (Task<string[]>)tasks[8];
            var wrStatesRaw = await (Task<string[]>)tasks[9];
            var tsSiteTypes = await (Task<string[]>)tasks[10];
            var tsPrimaryUses = await (Task<string[]>)tasks[11];
            var tsVariableTypes = await (Task<string[]>)tasks[12];
            var tsWaterSources = await (Task<string[]>)tasks[13];
            var tsStates = await (Task<string[]>)tasks[14];

            var wrBeneficialUses = rawUses
                .GroupBy(x => x.Name)
                .Select(g => new BeneficialUseItem
                {
                    BeneficialUseName = g.Key,
                    ConsumptionCategory = g.Max(x => Enum.TryParse<Common.ConsumptionCategory>(x.Category, out var category) ? category : Common.ConsumptionCategory.Unspecified)
                })
                .OrderBy(x => x.BeneficialUseName)
                .ToArray();

            string[] SplitAndDistinct(string[] raw) =>
                raw?
                    .Where(s => !string.IsNullOrEmpty(s))
                    .SelectMany(s => s.Split("||", System.StringSplitOptions.RemoveEmptyEntries))
                    .Distinct()
                    .OrderBy(n => n)
                    .ToArray()
                ?? System.Array.Empty<string>();

            var ownerClasses = SplitAndDistinct(ownerClassesRaw);
            var allocationTypes = SplitAndDistinct(allocationTypesRaw);
            var legalStatuses = SplitAndDistinct(legalStatusesRaw);
            var siteTypes = SplitAndDistinct(siteTypesRaw);
            var waterSources = SplitAndDistinct(waterSourcesRaw);
            var wrStates = SplitAndDistinct(wrStatesRaw);

            var wrRiverBasins = RiverBasinConstants.RiverBasinNames
                .OrderBy(n => n)
                .ToArray();

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
                    BeneficialUses = wrBeneficialUses,
                    OwnerClassifications = ownerClasses,
                    AllocationTypes = allocationTypes,
                    LegalStatuses = legalStatuses,
                    SiteTypes = siteTypes,
                    WaterSourceTypes = waterSources,
                    States = wrStates,
                    RiverBasins = wrRiverBasins
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
    }
}