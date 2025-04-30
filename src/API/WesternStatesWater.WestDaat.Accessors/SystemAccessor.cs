using System.Collections.Concurrent;
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

            foreach (var item in factories)
            {
                    results[item.Key] = await item.Factory();
            }

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

        private async Task<string[]> GetOverlayTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.ReportingUnitsDim
                .AsNoTracking()
                .Join(db.OverlayReportingUnitsFact,
                    rud => rud.ReportingUnitId,
                    rruf => rruf.ReportingUnitId,
                    (rud, rruf) => rruf)
                .Join(db.OverlayDim,
                    rruf => rruf.OverlayId,
                    rod => rod.OverlayId,
                    (rruf, rod) => rod)
                .Join(db.OverlayTypeCv,
                    rod => rod.OverlayTypeCV,
                    rotcv => rotcv.Name,
                    (rod, rotcv) => rotcv.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetOverlayWaterSources()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.OverlayReportingUnitsFact
                .AsNoTracking()
                .Join(db.OverlayDim,
                    rruf => rruf.OverlayId, 
                    rod => rod.OverlayId,
                    (rruf, rod) => rod.WaterSourceTypeCV)
                .Where(cv => cv != null)
                .Join(db.WaterSourceType,
                    cv => cv,
                    wstcv => wstcv.Name,
                    (cv, wstcv) => wstcv.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }


        private async Task<string[]> GetOverlayStates()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.ReportingUnitsDim
                .AsNoTracking()
                .Where(rud => !string.IsNullOrEmpty(rud.StateCv))
                .Select(rud => rud.StateCv.Trim())
                .Distinct()
                .OrderBy(state => state)
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
            return await db.AllocationAmountsFact
                .AsNoTracking()
                .Join(db.OwnerClassificationCv,
                    aaf => aaf.OwnerClassificationCV,
                    occv => occv.Name,
                    (aaf, occv) => occv.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetAllocationTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .AsNoTracking()
                .Join(db.WaterAllocationType,
                    aaf => aaf.AllocationTypeCv,
                    cvwat => cvwat.Name,
                    (aaf, cvwat) => cvwat.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetLegalStatuses()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .AsNoTracking()
                .Join(db.LegalStatus,
                    aaf => aaf.AllocationLegalStatusCv,
                    cvls => cvls.Name,
                    (aaf, cvls) => cvls.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetSiteTypes()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim
                .AsNoTracking()
                .Join(db.AllocationBridgeSitesFact,
                    sd => sd.SiteId,
                    absf => absf.SiteId,
                    (sd, absf) => sd)
                .Join(db.SiteType,
                    sd => sd.SiteTypeCv,
                    cvst => cvst.Name,
                    (sd, cvst) => cvst.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetWaterSources()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim
                .AsNoTracking()
                .Join(db.WaterSourceBridgeSitesFact,
                    s => s.SiteId,
                    wsbsf => wsbsf.SiteId,
                    (s, wsbsf) => wsbsf)
                .Join(db.WaterSourcesDim,
                    wsbsf => wsbsf.WaterSourceId,
                    wsd => wsd.WaterSourceId,
                    (wsbsf, wsd) => wsd)
                .Join(db.WaterSourceType,
                    wsd => wsd.WaterSourceTypeCv,
                    cv => cv.Name,
                    (wsd, cv) => cv.WaDEName)
                .Where(name => !string.IsNullOrEmpty(name))
                .Select(name => name.Trim())
                .Distinct()
                .OrderBy(name => name)
                .ToArrayAsync();
        }

        private async Task<string[]> GetWrStates()
        {
            await using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .AsNoTracking()
                .Join(db.OrganizationsDim,
                    aaf => aaf.OrganizationId,
                    od => od.OrganizationId,
                    (aaf, od) => od.State)
                .Where(state => !string.IsNullOrEmpty(state))
                .Select(state => state.Trim())
                .Distinct()
                .OrderBy(state => state)
                .ToArrayAsync();
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
            return await db.SiteVariableAmountsFact
                .AsNoTracking()
                .Join(db.SitesDim,
                    svaf => svaf.SiteId,
                    s => s.SiteId,
                    (svaf, s) => s.StateCv)
                .Where(state => !string.IsNullOrEmpty(state))
                .Distinct()
                .OrderBy(state => state)
                .ToArrayAsync();
        }
    }
}
