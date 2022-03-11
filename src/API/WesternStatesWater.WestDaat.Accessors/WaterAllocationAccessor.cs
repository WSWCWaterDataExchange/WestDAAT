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
            using (var db = _databaseContextFactory.Create())
            {
              var org = db.AllocationAmountsFact
                .Where(a => a.AllocationAmountId == allocationAmountId)
                .Select(a => a.Organization)
                .ProjectTo<Organization>(DtoMapper.Configuration)
                .Single();

                return org;
            }
        }

        async Task<List<AllocationAmount>> IWaterAllocationAccessor.GetAllWaterAllocations()
        {
            using (var db = _databaseContextFactory.Create())
            {
                var waterAllocations = await db.AllocationAmountsFact
                    .Include(x => x.AllocationBridgeSitesFact)
                    .ThenInclude(x => x.Site)
                    .ThenInclude(x => x.WaterSourceBridgeSitesFact)
                    .ThenInclude(x => x.WaterSource)
                    .Include(x => x.AllocationBridgeBeneficialUsesFact)
                    .ThenInclude(x => x.BeneficialUse)
                    .Include(x => x.AllocationPriorityDateNavigation)
                    .Take(10) // To Debug, remove after
                    .ProjectTo<AllocationAmount>(DtoMapper.Configuration)
                    .ToListAsync();

                return waterAllocations;
            }
        }
    }
}