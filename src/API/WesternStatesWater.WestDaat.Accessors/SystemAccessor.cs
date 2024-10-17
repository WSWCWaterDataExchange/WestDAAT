using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Extensions;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SystemAccessor : AccessorBase, ISystemAccessor
    {
        private readonly IDatabaseContextFactory _databaseContextFactory;

        public SystemAccessor(ILogger<SystemAccessor> logger, IDatabaseContextFactory databaseContextFactory)
            : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        async Task<DashboardFilters> ISystemAccessor.LoadFilters()
        {
            await using var db = _databaseContextFactory.Create();
            return new DashboardFilters
            {
                AllocationTypes = await db.WaterAllocationType.GetControlledVocabularyNames(),
                BeneficialUses = await GetBeneficialUseNames(db),
                LegalStatuses = await db.LegalStatus.GetControlledVocabularyNames(),
                OwnerClassifications = await db.OwnerClassificationCv.GetControlledVocabularyNames(),
                RiverBasins = RiverBasinConstants.RiverBasinNames.ToArray(),
                SiteTypes = await db.SiteType.GetControlledVocabularyNames(),
                States = await db.State.GetControlledVocabularyNames(),
                WaterSources = await db.WaterSourceType.GetControlledVocabularyNames()
            };
        }

        private static Task<BeneficialUseItem[]> GetBeneficialUseNames(DatabaseContext db)
        {
            return db.BeneficialUsesCV
                .ProjectTo<BeneficialUseItem>(DtoMapper.Configuration)
                .Distinct()
                .OrderBy(a => a.BeneficialUseName)
                .GroupBy(a => a.BeneficialUseName)
                .Select(g => g.OrderBy(c => c.ConsumptionCategory).LastOrDefault())
                .ToArrayAsync();
        }
    }
}