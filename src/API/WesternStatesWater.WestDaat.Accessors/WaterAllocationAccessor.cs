using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class WaterAllocationAccessor : AccessorBase, IWaterAllocationAccessor
    {
        public WaterAllocationAccessor(ILogger<WaterAllocationAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        Organization IWaterAllocationAccessor.GetWaterAllocationAmountOrganizationById(long allocationAmountId)
        {
            using var db = _databaseContextFactory.Create();
            var org = db.AllocationAmountsFact
              .Where(a => a.AllocationAmountId == allocationAmountId)
              .Select(a => a.Organization)
              .ProjectTo<Organization>(DtoMapper.Configuration)
              .Single();

            return org;
        }

        public async Task<WaterRightDetails> GetWaterRightDetailsById(long waterRightId)
        {
            using var db = _databaseContextFactory.Create();
            
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationAmountId == waterRightId)
                .ProjectTo<WaterRightDetails>(DtoMapper.Configuration)
                .SingleAsync();
        }

        public async Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(long waterRightId)
        {
            using var db = _databaseContextFactory.Create();
            
            return await db.AllocationBridgeSitesFact
                        .Where(x => x.AllocationAmountId == waterRightId)
                        .Select(x => x.Site)
                        .ProjectTo<SiteInfoListItem>(DtoMapper.Configuration)
                        .ToListAsync();
        }

        public async Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(long waterRightId)
        {
            using var db = _databaseContextFactory.Create();

            return await db.AllocationBridgeSitesFact.Where(x => x.AllocationAmountId == waterRightId)
                    .SelectMany(x => x.Site.WaterSourceBridgeSitesFact
                    .Select(a => a.WaterSource))
                    .ProjectTo<WaterSourceInfoListItem>(DtoMapper.Configuration)
                    .Distinct()
                    .ToListAsync();
        }

        async Task<List<AllocationAmount>> IWaterAllocationAccessor.GetAllWaterAllocations()
        {
            using var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            var waterAllocations = await db.AllocationAmountsFact
                .ProjectTo<AllocationAmount>(DtoMapper.Configuration)
                .ToListAsync();

            return waterAllocations;
        }

        async Task<List<SiteLocation>> IWaterAllocationAccessor.GetWaterRightSiteLocationsById(long waterRightId)
        {
            using var db = _databaseContextFactory.Create();

            return await db.AllocationBridgeSitesFact
                        .Where(x => x.AllocationAmountId == waterRightId)
                        .Select(x => x.Site)
                        .ProjectTo<SiteLocation>(DtoMapper.Configuration)
                        .ToListAsync();
        }
    }
}