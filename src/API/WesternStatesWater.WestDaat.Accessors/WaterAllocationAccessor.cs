using AutoMapper.QueryableExtensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Transactions;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class WaterAllocationAccessor : AccessorBase, IWaterAllocationAccessor
    {
        private readonly PerformanceConfiguration _performanceConfiguration;

        public WaterAllocationAccessor(ILogger<WaterAllocationAccessor> logger, IDatabaseContextFactory databaseContextFactory, PerformanceConfiguration performanceConfiguration) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
            _performanceConfiguration = performanceConfiguration;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        public async Task<AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var analyticsSummary = await db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                // Distinct forces proper grouping by beneficialUse query
                .Select(a => new { a.AllocationFlow_CFS, a.AllocationVolume_AF, a.PrimaryBeneficialUseCategory, a.AllocationAmountId })
                .Distinct()
                .GroupBy(a => a.PrimaryBeneficialUseCategory)
                .Select(a => new AnalyticsSummaryInformation
                {
                    Flow = a.Sum(c => c.AllocationFlow_CFS),
                    PrimaryUseCategoryName = a.Key,
                    Points = a.Count(),
                    Volume = a.Sum(c => c.AllocationVolume_AF),
                })
                .ToArrayAsync();

            ts.Complete();

            return analyticsSummary;
        }

        public async Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var waterRightDetails = await db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationUuid)
                .Skip(searchCriteria.PageNumber * _performanceConfiguration.WaterRightsSearchPageSize)
                .Take(_performanceConfiguration.WaterRightsSearchPageSize + 1)
                .ProjectTo<WaterRightsSearchDetail>(DtoMapper.Configuration)
                .ToArrayAsync();

            ts.Complete();

            return new WaterRightsSearchResults
            {
                CurrentPageNumber = searchCriteria.PageNumber,
                HasMoreResults = waterRightDetails.Length > _performanceConfiguration.WaterRightsSearchPageSize,
                WaterRightsDetails = waterRightDetails.Take(_performanceConfiguration.WaterRightsSearchPageSize).ToArray()
            };
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildWaterRightsSearchPredicate(WaterRightsSearchCriteria searchCriteria, DatabaseContext db)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate.And(BuildBeneficialUsesPredicate(searchCriteria));

            predicate.And(BuildOwnerSearchPredicate(searchCriteria));

            predicate.And(BuildSiteDetailsPredicate(searchCriteria));

            predicate.And(BuildVolumeAndFlowPredicate(searchCriteria));

            predicate.And(BuildDatePredicate(searchCriteria));

            predicate.And(BuildGeometrySearchPredicate(searchCriteria));

            predicate.And(BuildFromSiteUuids(searchCriteria, db));

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildFromSiteUuids(WaterRightsSearchCriteria searchCriteria, DatabaseContext db)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.WadeSitesUuids != null && searchCriteria.WadeSitesUuids.Any())
            {
                db.Database.ExecuteSqlRaw(Scripts.Scripts.CreateTempUuidTable);

                // Unsafe mode is because does not have a key
                db.BulkInsert(searchCriteria.WadeSitesUuids.Select(a => new TempUuid { Uuid = a }), b => b.UnsafeMode = true);

                db.Database.ExecuteSqlRaw(Scripts.Scripts.CreateTempIdTable);
                db.Database.ExecuteSqlRaw(Scripts.Scripts.FindSiteIdsFromUuids);

                predicate = predicate.And(AllocationAmountsFact.HasSitesUuids(db));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildBeneficialUsesPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.BeneficialUses != null && searchCriteria.BeneficialUses.Any())
            {
                predicate = predicate.And(AllocationAmountsFact.HasBeneficialUses(searchCriteria.BeneficialUses.ToList()));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildDatePredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.MinimumPriorityDate != null || searchCriteria?.MaximumPriorityDate != null)
            {
                predicate.And(AllocationAmountsFact.HasPriorityDateRange(searchCriteria.MinimumPriorityDate, searchCriteria.MaximumPriorityDate));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildVolumeAndFlowPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.ExemptOfVolumeFlowPriority != null)
            {
                predicate.And(AllocationAmountsFact.IsExemptOfVolumeFlowPriority(searchCriteria.ExemptOfVolumeFlowPriority.Value));
            }

            if (searchCriteria?.MinimumFlow != null || searchCriteria?.MaximumFlow != null)
            {
                predicate.And(AllocationAmountsFact.HasFlowRateRange(searchCriteria.MinimumFlow, searchCriteria.MaximumFlow));
            }

            if (searchCriteria?.MinimumVolume != null || searchCriteria?.MaximumVolume != null)
            {
                predicate.And(AllocationAmountsFact.HasVolumeRange(searchCriteria.MinimumVolume, searchCriteria.MaximumVolume));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildOwnerSearchPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.OwnerClassifications != null && searchCriteria.OwnerClassifications.Any())
            {
                predicate.And(AllocationAmountsFact.HasOwnerClassification(searchCriteria.OwnerClassifications.ToList()));
            }

            if (!string.IsNullOrWhiteSpace(searchCriteria?.AllocationOwner))
            {
                predicate.And(AllocationAmountsFact.HasAllocationOwner(searchCriteria.AllocationOwner));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildSiteDetailsPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.WaterSourceTypes != null && searchCriteria.WaterSourceTypes.Any())
            {
                predicate.And(AllocationAmountsFact.HasWaterSourceTypes(searchCriteria.WaterSourceTypes.ToList()));
            }

            if (searchCriteria?.States != null && searchCriteria.States.Any())
            {
                predicate.And(AllocationAmountsFact.HasOrganizationStates(searchCriteria.States.ToList()));
            }

            if (!string.IsNullOrWhiteSpace(searchCriteria?.PodOrPou))
            {
                predicate.And(AllocationAmountsFact.IsPodOrPou(searchCriteria.PodOrPou));
            }

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildGeometrySearchPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.FilterGeometry != null)
            {
                predicate.And(AllocationAmountsFact.IsWithinGeometry(searchCriteria.FilterGeometry));
            }

            return predicate;
        }

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

        public async Task<WaterRightDetails> GetWaterRightDetailsById(string allocationUuid)
        {
            using var db = _databaseContextFactory.Create();
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationUuid == allocationUuid)
                .ProjectTo<WaterRightDetails>(DtoMapper.Configuration)
                .SingleAsync();
        }

        public async Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(string allocationUuid)
        {
            using var db = _databaseContextFactory.Create();
            return await db.AllocationBridgeSitesFact
                        .Where(x => x.AllocationAmount.AllocationUuid == allocationUuid)
                        .Select(x => x.Site)
                        .ProjectTo<SiteInfoListItem>(DtoMapper.Configuration)
                        .ToListAsync();
        }

        public async Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(string allocationUuid)
        {
            using var db = _databaseContextFactory.Create();
            return await db.AllocationBridgeSitesFact.Where(x => x.AllocationAmount.AllocationUuid == allocationUuid)
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

        async Task<List<SiteLocation>> IWaterAllocationAccessor.GetWaterRightSiteLocationsById(string allocationUuid)
        {
            using var db = _databaseContextFactory.Create();
            return await db.AllocationBridgeSitesFact
                        .Where(x => x.AllocationAmount.AllocationUuid == allocationUuid)
                        .Select(x => x.Site)
                        .Where(x => x.Longitude.HasValue && x.Latitude.HasValue)
                        .ProjectTo<SiteLocation>(DtoMapper.Configuration)
                        .ToListAsync();
        }

        async Task<List<WaterRightsDigest>> IWaterAllocationAccessor.GetWaterRightsDigestsBySite(string siteUuid)
        {
            using var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationBridgeSitesFact.Any(y => y.Site.SiteUuid == siteUuid))
                .ProjectTo<WaterRightsDigest>(DtoMapper.Configuration)
                .ToListAsync();
        }

        int IWaterAllocationAccessor.GetWaterRightsCount(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var count =  db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .Count();

            ts.Complete();

            return count;
        }

        IEnumerable<IEnumerable<object>> IWaterAllocationAccessor.GetWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var waterRightDetails = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate);

            var filteredSites = db.SitesDim
                .AsNoTracking()
                .Where(a => a.AllocationBridgeSitesFact
                    .Select(b => b.AllocationAmount)
                    .Intersect(waterRightDetails)
                    .Any());

            var response = new List<IEnumerable<object>>()
            {
                waterRightDetails.Select(x=>x.VariableSpecific).ProjectTo<CsvModels.Variables>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.VariableSpecificUuid),
                waterRightDetails.Select(x=>x.Organization).ProjectTo<CsvModels.Organizations>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.OrganizationUuid),
                waterRightDetails.Select(x=>x.Method).ProjectTo<CsvModels.Methods>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.MethodUuid),
                filteredSites.SelectMany(x=>x.AllocationBridgeSitesFact).ProjectTo<CsvModels.WaterAllocations>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.AllocationUuid),
                filteredSites.SelectMany(c=>c.PODSiteToPOUSitePODFact).ProjectTo<CsvModels.PodSiteToPouSiteRelationships>(DtoMapper.Configuration),
                filteredSites.SelectMany(b=>b.WaterSourceBridgeSitesFact).Select(c=>c.WaterSource).ProjectTo<CsvModels.WaterSources>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.WaterSourceUuid),
                filteredSites.ProjectTo<CsvModels.Sites>(DtoMapper.Configuration).AsEnumerable().DistinctBy(x=>x.SiteUuid),
            };

            foreach (var entry in response)
            {
                yield return entry;
            }

            ts.Complete();
        }
    }
}
