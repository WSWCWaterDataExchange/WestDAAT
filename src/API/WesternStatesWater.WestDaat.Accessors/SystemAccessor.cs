using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SystemAccessor : AccessorBase, ISystemAccessor
    {
        public SystemAccessor(ILogger<SystemAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        async Task<List<string>> ISystemAccessor.GetAvailableBeneficialUseNormalizedNames()
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.BeneficialUsesCV
                  .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
                  .Distinct()
                  .OrderBy(a => a)
                  .ToListAsync();
            }
        }

        async Task<List<string>> ISystemAccessor.GetAvailableWaterSourceTypeNormalizedNames()
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.WaterSourceType
                  .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
                  .Distinct()
                  .OrderBy(a => a)
                  .ToListAsync();
            }
        }

        async Task<List<string>> ISystemAccessor.GetAvailableOwnerClassificationNormalizedNames()
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.OwnerClassificationCv
                  .Select(a => a.WaDEName.Length > 0 ? a.WaDEName : a.Name)
                  .Distinct()
                  .OrderBy(a => a)
                  .ToListAsync();
            }
        }
    }
}