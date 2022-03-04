using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Logging;
using System.Linq;
using AutoMapper.QueryableExtensions;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

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
    }
}