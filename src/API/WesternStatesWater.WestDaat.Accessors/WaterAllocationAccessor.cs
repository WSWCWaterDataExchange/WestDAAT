using AutoMapper.QueryableExtensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.CsvModels;
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
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria);

            using var db = _databaseContextFactory.Create();

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

            return analyticsSummary;
        }

        public async Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria);

            using var db = _databaseContextFactory.Create();

            var waterRightDetails = await db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationUuid)
                .Skip(searchCriteria.PageNumber * _performanceConfiguration.WaterRightsSearchPageSize)
                .Take(_performanceConfiguration.WaterRightsSearchPageSize + 1)
                .ProjectTo<WaterRightsSearchDetail>(DtoMapper.Configuration)
                .ToArrayAsync();

            return new WaterRightsSearchResults
            {
                CurrentPageNumber = searchCriteria.PageNumber,
                HasMoreResults = waterRightDetails.Length > _performanceConfiguration.WaterRightsSearchPageSize,
                WaterRightsDetails = waterRightDetails.Take(_performanceConfiguration.WaterRightsSearchPageSize).ToArray()
            };
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildWaterRightsSearchPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>();

            predicate.And(BuildBeneficialUsesPredicate(searchCriteria));

            predicate.And(BuildOwnerSearchPredicate(searchCriteria));

            predicate.And(BuildSiteDetailsPredicate(searchCriteria));

            predicate.And(BuildVolumeAndFlowPredicate(searchCriteria));

            predicate.And(BuildDatePredicate(searchCriteria));

            predicate.And(BuildGeometrySearchPredicate(searchCriteria));

            predicate.And(BuildFromSiteUuids(searchCriteria));

            return predicate;
        }

        private static ExpressionStarter<AllocationAmountsFact> BuildFromSiteUuids(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if (searchCriteria?.WadeSitesUuids != null && searchCriteria.WadeSitesUuids.Any())
            {
                predicate = predicate.And(AllocationAmountsFact.HasSitesUuids(searchCriteria.WadeSitesUuids.ToList()));
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

        private async Task<ConcurrentDictionary<long, ConcurrentBag<string>>> GetBeneficialUsesForAllocations(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, allocationAmountsFacts) = GetWaterRightsDB(searchCriteria);
            var matchingBeneficialUses = db.AllocationBridgeBeneficialUsesFact
                .Where(a => allocationAmountsFacts.Any(b => b.AllocationAmountId == a.AllocationAmountId))
                .Select(a => new { a.AllocationAmountId, BeneficialUse = a.BeneficialUse.WaDEName ?? a.BeneficialUseCV })
                .AsAsyncEnumerable();

            var allBeneficialUses = new ConcurrentDictionary<long, ConcurrentBag<string>>();
            await Parallel.ForEachAsync(matchingBeneficialUses, (use, ct) =>
            {
                allBeneficialUses.GetOrAdd(use.AllocationAmountId, new ConcurrentBag<string>())
                    .Add(use.BeneficialUse);
                return ValueTask.CompletedTask;
            });
            return allBeneficialUses;
        }

        private async Task<ConcurrentDictionary<long, ConcurrentBag<string>>> GetSitesForAllocations(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, allocationAmountsFacts) = GetWaterRightsDB(searchCriteria);
            var matchingSites = db.AllocationBridgeSitesFact
                .Where(a => allocationAmountsFacts.Any(b => b.AllocationAmountId == a.AllocationAmountId))
                .Select(a => new { a.AllocationAmountId, a.Site.SiteUuid })
                .AsAsyncEnumerable();


            var allSiteAllocations = new ConcurrentDictionary<long, ConcurrentBag<string>>();
            await Parallel.ForEachAsync(matchingSites, (site, ct) =>
            {
                allSiteAllocations.GetOrAdd(site.AllocationAmountId, new ConcurrentBag<string>())
                    .Add(site.SiteUuid);
                return ValueTask.CompletedTask;
            });
            return allSiteAllocations;
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
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria);

            using var db = _databaseContextFactory.Create();
            return db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .Count();
        }

        private async IAsyncEnumerable<CsvModels.WaterAllocations> GetWaterRightDetails(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, allocationAmountsFacts) = GetWaterRightsDB(searchCriteria);

            var allSiteAllocationsTask = GetSitesForAllocations(searchCriteria);

            var allBeneficialUses = await GetBeneficialUsesForAllocations(searchCriteria);
            // TODO add comment about parallism stuff? Nathan says no
            var allSiteAllocations = await allSiteAllocationsTask;

            var test = allocationAmountsFacts
                .ProjectTo<WaterAllocationsHelper>(DtoMapper.Configuration)
                .AsAsyncEnumerable();
            await foreach(var item in test)
            {
                item.SiteUuid = string.Join(",", allSiteAllocations.GetValueOrDefault(item.AllocationAmountId) ?? new ConcurrentBag<string>());
                item.BeneficialUseCategory = string.Join(",", allBeneficialUses.GetValueOrDefault(item.AllocationAmountId) ?? new ConcurrentBag<string>());
                yield return item.Map<CsvModels.WaterAllocations>();
            }
        }

        internal class WaterAllocationsHelper: CsvModels.WaterAllocations
        {
            public long AllocationAmountId { get; set; }
        }

        IEnumerable<(string Name, IEnumerable<object> Data)> IWaterAllocationAccessor.GetWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            // TODO: build predicate here
            var variables = GetVariables(searchCriteria);
            var organizations = GetOrganizations(searchCriteria);
            var methods = GetMethods(searchCriteria);
            var podtopou = GetPODToPOU(searchCriteria);
            var waterSources = GetWaterSources(searchCriteria);
            var waterRights = GetWaterRightDetails(searchCriteria).ToEnumerable();
            var sites = GetSites(searchCriteria);

            yield return ("Variables", variables);

            //yield return waterRightDetails.Select(x => x.VariableSpecific).Distinct().ProjectTo<CsvModels.Variables>(DtoMapper.Configuration).ToList();
            yield return ("Organizations", organizations);

            //yield return waterRightDetails.Select(x => x.Organization).Distinct().ProjectTo<CsvModels.Organizations>(DtoMapper.Configuration).AsEnumerable();
            yield return ("Methods", methods);

            //yield return waterRightDetails.Select(x => x.Method).Distinct().ProjectTo<CsvModels.Methods>(DtoMapper.Configuration).AsEnumerable();
            yield return ("WaterAllocations", waterRights);

            yield return ("PodToPou", podtopou);

            //yield return filteredSites.SelectMany(c => c.PODSiteToPOUSitePODFact).ProjectTo<CsvModels.PodSiteToPouSiteRelationships>(DtoMapper.Configuration);
            yield return ("WaterSources", waterSources);
            //yield return filteredSites.SelectMany(b => b.WaterSourceBridgeSitesFact).Select(c => c.WaterSource).Distinct().ProjectTo<CsvModels.WaterSources>(DtoMapper.Configuration).AsEnumerable();
            yield return ("Sites", sites);
        }

        private IEnumerable<Sites> GetSites(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            return filteredSites.ProjectTo<CsvModels.Sites>(DtoMapper.Configuration).AsEnumerable();
        }

        private IEnumerable<WaterSources> GetWaterSources(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            return db.WaterSourcesDim.Where(a => filteredSites.SelectMany(y => y.WaterSourceBridgeSitesFact).Any(x => x.WaterSourceId == a.WaterSourceId)).ProjectTo<CsvModels.WaterSources>(DtoMapper.Configuration).AsEnumerable();
        }

        private (DatabaseContext DB, IQueryable<SitesDim> FilteredSites) GetFilteredSites(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetWaterRightsDB(searchCriteria);

            var sites = db.SitesDim
                .AsNoTracking()
                .Where(a => a.AllocationBridgeSitesFact
                    .Any(c => waterRightDetails
                        .Any(d => d.AllocationAmountId == c.AllocationAmountId)));

            return (db, sites);
        }

        private IEnumerable<PodSiteToPouSiteRelationships> GetPODToPOU(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            return db.PODSiteToPOUSiteFact
                .Where(a => filteredSites
                    .Any(b => b.SiteId == a.PODSiteId) 
                    || filteredSites.Any(b => b.SiteId == a.POUSiteId))
                .ProjectTo<CsvModels.PodSiteToPouSiteRelationships>(DtoMapper.Configuration).AsEnumerable();
        }

        private IEnumerable<Methods> GetMethods(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetWaterRightsDB(searchCriteria);

            return db.MethodsDim.Where(a => waterRightDetails.Any(x => x.MethodId == a.MethodId)).ProjectTo<CsvModels.Methods>(DtoMapper.Configuration).AsEnumerable();
        }

        private IEnumerable<Organizations> GetOrganizations(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetWaterRightsDB(searchCriteria);

            return db.OrganizationsDim.Where(a => waterRightDetails.Any(x => x.OrganizationId == a.OrganizationId)).ProjectTo<CsvModels.Organizations>(DtoMapper.Configuration).AsEnumerable();
        }

        private IEnumerable<Variables> GetVariables(WaterRightsSearchCriteria searchCriteria)
        {
            // don't forget to make nathan look at the count function
            var (db, waterRightDetails) = GetWaterRightsDB(searchCriteria);
            return db.VariablesDim.Where(a => waterRightDetails.Any(x => x.VariableSpecificId == a.VariableSpecificId)).ProjectTo<CsvModels.Variables>(DtoMapper.Configuration).AsEnumerable();
        }

        private (DatabaseContext DB, IQueryable<AllocationAmountsFact> AllocationAmounts) GetWaterRightsDB(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria);
            var db = _databaseContextFactory.Create();
            var waterRightDetails = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate);

            return (db, waterRightDetails);
        }
    }
}
