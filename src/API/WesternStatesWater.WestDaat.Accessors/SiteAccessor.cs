﻿using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SiteAccessor : AccessorBase, ISiteAccessor
    {
        public SiteAccessor(ILogger<SiteAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly EF.IDatabaseContextFactory _databaseContextFactory;

        async Task<Site> ISiteAccessor.GetSiteByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim
                .Where(x => x.SiteUuid == siteUuid)
                .ProjectTo<Site>(DtoMapper.Configuration)
                .SingleAsync();
        }

        async Task<SiteDigest> ISiteAccessor.GetSiteDigestByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim
                .AsNoTracking()
                .Where(x => x.SiteUuid == siteUuid)
                .ProjectTo<SiteDigest>(DtoMapper.Configuration)
                .SingleAsync();
        }

        async Task<List<Site>> ISiteAccessor.GetSites()
        {
            var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            return await db.SitesDim
                .ProjectTo<Site>(DtoMapper.Configuration)
                .ToListAsync();
        }

        public async Task<SiteDetails> GetSiteDetailsByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim
                .Where(x => x.SiteUuid == siteUuid)
                .ProjectTo<SiteDetails>(DtoMapper.Configuration)
                .SingleAsync();
        }

        async Task<SiteLocation> ISiteAccessor.GetWaterSiteLocationByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim.Where(x => x.SiteUuid == siteUuid)
                .ProjectTo<SiteLocation>(DtoMapper.Configuration)
                .SingleAsync();
        }

        public async Task<List<WaterSourceInfoListItem>> GetWaterSiteSourceInfoListByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SitesDim.Where(x => x.SiteUuid == siteUuid)
                .SelectMany(x => x.WaterSourceBridgeSitesFact
                    .Select(a => a.WaterSource))
                .ProjectTo<WaterSourceInfoListItem>(DtoMapper.Configuration)
                .ToListAsync();
        }

        public async Task<List<WaterRightInfoListItem>> GetWaterRightInfoListByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationBridgeSitesFact.Any(y => y.Site.SiteUuid == siteUuid))
                .ProjectTo<WaterRightInfoListItem>(DtoMapper.Configuration)
                .ToListAsync();
        }
        
        public async Task<List<WaterRightInfoListItem>> GetWaterRightInfoListByReportingUnitUuid(string reportingUnitUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .Where(aaf => aaf.AllocationBridgeSitesFact.Any(absf =>
                    absf.Site.OverlayBridgeSitesFact.Any(robsf =>
                        robsf.Overlay.OverlayReportingUnitsFact.Any(rruf =>
                            rruf.ReportingUnit.ReportingUnitUuid == reportingUnitUuid))))
                .ProjectTo<WaterRightInfoListItem>(DtoMapper.Configuration)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<SiteUsagePoint>> GetSiteUsageBySiteUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.SiteVariableAmountsFact
                .Where(x => x.Site.SiteUuid == siteUuid)
                .ProjectTo<SiteUsagePoint>(DtoMapper.Configuration)
                .OrderBy(x => x.TimeFrameStartDate)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<SiteUsageListItem>> GetSiteUsageInfoListBySiteUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();

            var query = from timeser in db.SiteVariableAmountsFact
                join aaf in db.AllocationAmountsFact
                    on timeser.AssociatedNativeAllocationIds equals aaf.AllocationNativeId into allocs
                from aaf in allocs.DefaultIfEmpty()
                where timeser.Site.SiteUuid == siteUuid
                orderby timeser.TimeframeStartNavigation.Date
                select new SiteUsageListItem
                {
                    WaDEVariableUuid = timeser.VariableSpecific.VariableSpecificUuid,
                    WaDEMethodUuid = timeser.Method.MethodUuid,
                    WaDEWaterSourceUuid = timeser.WaterSource.WaterSourceUuid,
                    TimeframeStart = timeser.TimeframeStartNavigation.Date,
                    TimeframeEnd = timeser.TimeframeEndNavigation.Date,
                    ReportYear = timeser.ReportYearCv,
                    Amount = timeser.Amount,
                    PrimaryUse = timeser.PrimaryBeneficialUse.WaDEName,
                    PopulationServed = timeser.PopulationServed,
                    CropDutyAmount = timeser.AllocationCropDutyAmount,
                    CommunityWaterSupplySystem = timeser.CommunityWaterSupplySystem,
                    AssociatedNativeAllocationId = timeser.AssociatedNativeAllocationIds,
                    AllocationUuid = aaf != null ? aaf.AllocationUuid : null
                };

            return await query.ToListAsync();
        }

        
        public async Task<IEnumerable<VariableInfoListItem>> GetVariableInfoListByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.VariablesDim.Where(x => x.SiteVariableAmountsFact.Any(y => y.Site.SiteUuid == siteUuid))
                .ProjectTo<VariableInfoListItem>(DtoMapper.Configuration)
                .OrderBy(x => x.WaDEVariableUuid)
                .ToListAsync()
                ;
        }
        
        public async Task<IEnumerable<MethodInfoListItem>> GetMethodInfoListByUuid(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            return await db.MethodsDim.Where(x => x.SiteVariableAmountsFact.Any(y => y.Site.SiteUuid == siteUuid))
                .ProjectTo<MethodInfoListItem>(DtoMapper.Configuration)
                .OrderBy(x => x.WaDEMethodUuid)
                .ToListAsync();
        }

        public IEnumerable<GeoConnex> GetJSONLDData()
        {
            var db = _databaseContextFactory.Create();
            var query = db.SitesDim.Select(a => new GeoConnex
            {
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                SiteTypeCv = a.SiteTypeCv,
                SiteUuid = a.SiteUuid,
                SiteName = a.SiteName,
            });

            return query;
        }
    }
}