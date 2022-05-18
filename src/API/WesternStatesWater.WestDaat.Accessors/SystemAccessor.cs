using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SystemAccessor : AccessorBase, ISystemAccessor
    {
        public SystemAccessor(ILogger<SystemAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        async Task<List<BeneficialUseItem>> ISystemAccessor.GetAvailableBeneficialUseNormalizedNames()
        {
            using var db = _databaseContextFactory.Create();

            return await db.BeneficialUsesCV
                .ProjectTo<BeneficialUseItem>(DtoMapper.Configuration)
                .Distinct()
                .OrderBy(a => a.BeneficialUseName)
                .GroupBy(a => a.BeneficialUseName)
                .Select(g => g.OrderBy(c => c.ConsumptionCategory).LastOrDefault())
                .ToListAsync();
        }

        async Task<List<string>> ISystemAccessor.GetAvailableWaterSourceTypeNormalizedNames()
        {
            using var db = _databaseContextFactory.Create();
            return await db.WaterSourceType
              .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
              .Distinct()
              .OrderBy(a => a)
              .ToListAsync();
        }

        async Task<List<string>> ISystemAccessor.GetAvailableOwnerClassificationNormalizedNames()
        {
            using var db = _databaseContextFactory.Create();
            return await db.OwnerClassificationCv
              .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
              .Distinct()
              .OrderBy(a => a)
              .ToListAsync();
        }

        async Task<List<string>> ISystemAccessor.GetAvailableStateNormalizedNames()
        {
            using var db = _databaseContextFactory.Create();
            return await db.State
              .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
              .Distinct()
              .OrderBy(a => a)
              .ToListAsync();
        }
    }
}