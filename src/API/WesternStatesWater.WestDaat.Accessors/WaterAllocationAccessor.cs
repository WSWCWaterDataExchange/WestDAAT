using AutoMapper.QueryableExtensions;
using EFCore.BulkExtensions;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;
using System.Collections.Concurrent;
using System.Transactions;
using NetTopologySuite.Geometries.Utilities;
using WesternStatesWater.WestDaat.Accessors.CsvModels;
using WesternStatesWater.WestDaat.Accessors.Extensions;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class WaterAllocationAccessor : AccessorBase, IWaterAllocationAccessor
    {
        private readonly PerformanceConfiguration _performanceConfiguration;

        public WaterAllocationAccessor(ILogger<WaterAllocationAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory, PerformanceConfiguration performanceConfiguration) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
            _performanceConfiguration = performanceConfiguration;
        }

        private readonly EF.IDatabaseContextFactory _databaseContextFactory;

        public async Task<AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(WaterRightsSearchCriteria searchCriteria, Common.AnalyticsInformationGrouping? groupValue)
        {
            groupValue ??= Common.AnalyticsInformationGrouping.BeneficialUse;

            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            await using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            await db.Database.OpenConnectionAsync();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var analyticsSummaryQuery = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate);

            var summaryQueryGroupBy = BuildGetAnalyticsSummaryInformationGroupByQuery(analyticsSummaryQuery, groupValue.Value);

            var analyticsSummary = await summaryQueryGroupBy
                .ToArrayAsync();

            ts.Complete();

            return analyticsSummary;
        }

        private IQueryable<AnalyticsSummaryInformation> BuildGetAnalyticsSummaryInformationGroupByQuery(IQueryable<AllocationAmountsFact> query, Common.AnalyticsInformationGrouping groupBy)
        {
            IQueryable<AnalyticsSummaryInformation> result = null;
            switch (groupBy)
            {
                case Common.AnalyticsInformationGrouping.BeneficialUse:
                    result = query
                        .Select(a => new { a.AllocationFlow_CFS, a.AllocationVolume_AF, a.PrimaryBeneficialUseCategory, a.AllocationAmountId })
                        .Distinct()
                        .GroupBy(a => a.PrimaryBeneficialUseCategory)
                        .Select(a => new AnalyticsSummaryInformation
                        {
                            Flow = a.Sum(c => c.AllocationFlow_CFS),
                            PrimaryUseCategoryName = a.Key,
                            Points = a.Count(),
                            Volume = a.Sum(c => c.AllocationVolume_AF),
                        });
                    break;
                case Common.AnalyticsInformationGrouping.OwnerType:
                    result = query
                        .Select(a => new { a.AllocationFlow_CFS, a.AllocationVolume_AF, a.OwnerClassificationCV, a.AllocationAmountId })
                        .Distinct()
                        .GroupBy(a => a.OwnerClassificationCV)
                        .Select(a => new AnalyticsSummaryInformation
                        {
                            Flow = a.Sum(c => c.AllocationFlow_CFS),
                            PrimaryUseCategoryName = a.Key,
                            Points = a.Count(),
                            Volume = a.Sum(c => c.AllocationVolume_AF),
                        });
                    break;
                case Common.AnalyticsInformationGrouping.AllocationType:
                    result = query
                        .Select(a => new { a.AllocationFlow_CFS, a.AllocationVolume_AF, a.AllocationTypeCv, a.AllocationAmountId })
                        .Distinct()
                        .GroupBy(a => a.AllocationTypeCv)
                        .Select(a => new AnalyticsSummaryInformation
                        {
                            Flow = a.Sum(c => c.AllocationFlow_CFS),
                            PrimaryUseCategoryName = a.Key,
                            Points = a.Count(),
                            Volume = a.Sum(c => c.AllocationVolume_AF),
                        });
                    break;
                case Common.AnalyticsInformationGrouping.LegalStatus:
                    result = query
                        .Select(a => new { a.AllocationFlow_CFS, a.AllocationVolume_AF, a.AllocationLegalStatusCv, a.AllocationAmountId })
                        .Distinct()
                        .GroupBy(a => a.AllocationLegalStatusCv)
                        .Select(a => new AnalyticsSummaryInformation
                        {
                            Flow = a.Sum(c => c.AllocationFlow_CFS),
                            PrimaryUseCategoryName = a.Key,
                            Points = a.Count(),
                            Volume = a.Sum(c => c.AllocationVolume_AF),
                        });
                    break;
                case Common.AnalyticsInformationGrouping.SiteType:
                    result = query
                        .Select(a => new
                        {
                            a.AllocationFlow_CFS,
                            a.AllocationVolume_AF,
                            a.AllocationAmountId,
                            SiteTypes = a.AllocationBridgeSitesFact.Select(absf => absf.Site.SiteTypeCv)
                        })
                        .Distinct()
                        .GroupBy(a => a.SiteTypes)
                        .Select(a => new AnalyticsSummaryInformation
                        {
                            Flow = a.Sum(c => c.AllocationFlow_CFS),
                            PrimaryUseCategoryName = string.Join(",", a.Key),
                            Points = a.Count(),
                            Volume = a.Sum(c => c.AllocationVolume_AF),
                        });
                    break;
            }

            return result;
        }

        public async Task<Geometry> GetWaterRightsEnvelope(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            await using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            await db.Database.OpenConnectionAsync();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            // Get SiteIds based on search predicate
            var siteIds = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .SelectMany(a => a.AllocationBridgeSitesFact.Select(b => b.SiteId));

            // Retrieve geometries based on the SiteIds
            var geometries = db.SitesDim
                .AsNoTracking()
                .Where(sdf => siteIds.Contains(sdf.SiteId))
                .Select(sdf => sdf.Geometry ?? sdf.SitePoint);

            // Combine geometries using EnvelopeCombiner
            var geometry = EnvelopeCombiner.CombineAsGeometry(geometries);

            ts.Complete();

            return geometry.IsEmpty ? null : GeometryHelpers.GetGeometryByWkt(geometry.ToString());
        }

        public async Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria searchCriteria, int pageNumber)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            await using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            await db.Database.OpenConnectionAsync();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var waterRightDetails = await db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .OrderBy(x => x.AllocationPriorityDateNavigation.Date)
                .ThenBy(x => x.AllocationUuid)
                .Skip(pageNumber * _performanceConfiguration.WaterRightsSearchPageSize)
                .Take(_performanceConfiguration.WaterRightsSearchPageSize + 1)
                .ProjectTo<WaterRightsSearchDetail>(DtoMapper.Configuration)
                .ToArrayAsync();

            ts.Complete();

            return new WaterRightsSearchResults
            {
                CurrentPageNumber = pageNumber,
                HasMoreResults = waterRightDetails.Length > _performanceConfiguration.WaterRightsSearchPageSize,
                WaterRightsDetails = waterRightDetails.Take(_performanceConfiguration.WaterRightsSearchPageSize).ToArray()
            };
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildWaterRightsSearchPredicate(WaterRightsSearchCriteria searchCriteria, DatabaseContext db)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>();

            predicate.And(BuildBeneficialUsesPredicate(searchCriteria));

            predicate.And(BuildOwnerSearchPredicate(searchCriteria));

            predicate.And(BuildSiteDetailsPredicate(searchCriteria));

            predicate.And(BuildVolumeAndFlowPredicate(searchCriteria));

            predicate.And(BuildDatePredicate(searchCriteria));

            predicate.And(BuildGeometrySearchPredicate(searchCriteria));

            predicate.And(BuildFromSiteUuids(searchCriteria, db));

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildFromSiteUuids(WaterRightsSearchCriteria searchCriteria, DatabaseContext db)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.WadeSitesUuids != null && searchCriteria.WadeSitesUuids.Any())
            {
                db.Database.ExecuteSqlRaw(Scripts.Scripts.CreateTempUuidTable);

                db.BulkInsert(searchCriteria.WadeSitesUuids.Select(a => new EF.TempUuid { Uuid = a }).ToList());

                db.Database.ExecuteSqlRaw(Scripts.Scripts.CreateTempIdTable);
                db.Database.ExecuteSqlRaw(Scripts.Scripts.FindSiteIdsFromUuids);

                predicate = predicate.And(EF.AllocationAmountsFact.HasSitesUuids(db));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildBeneficialUsesPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.BeneficialUses != null && searchCriteria.BeneficialUses.Any())
            {
                predicate = predicate.And(EF.AllocationAmountsFact.HasBeneficialUses(searchCriteria.BeneficialUses.ToList()));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildDatePredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.MinimumPriorityDate != null || searchCriteria?.MaximumPriorityDate != null)
            {
                predicate.And(EF.AllocationAmountsFact.HasPriorityDateRange(searchCriteria.MinimumPriorityDate, searchCriteria.MaximumPriorityDate));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildVolumeAndFlowPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.ExemptOfVolumeFlowPriority != null)
            {
                predicate.And(EF.AllocationAmountsFact.IsExemptOfVolumeFlowPriority(searchCriteria.ExemptOfVolumeFlowPriority.Value));
            }

            if (searchCriteria?.MinimumFlow != null || searchCriteria?.MaximumFlow != null)
            {
                predicate.And(EF.AllocationAmountsFact.HasFlowRateRange(searchCriteria.MinimumFlow, searchCriteria.MaximumFlow));
            }

            if (searchCriteria?.MinimumVolume != null || searchCriteria?.MaximumVolume != null)
            {
                predicate.And(EF.AllocationAmountsFact.HasVolumeRange(searchCriteria.MinimumVolume, searchCriteria.MaximumVolume));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildOwnerSearchPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.OwnerClassifications != null && searchCriteria.OwnerClassifications.Any())
            {
                predicate.And(EF.AllocationAmountsFact.HasOwnerClassification(searchCriteria.OwnerClassifications.ToList()));
            }

            if (!string.IsNullOrWhiteSpace(searchCriteria?.AllocationOwner))
            {
                predicate.And(EF.AllocationAmountsFact.HasAllocationOwner(searchCriteria.AllocationOwner));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildSiteDetailsPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.WaterSourceTypes != null && searchCriteria.WaterSourceTypes.Any())
            {
                predicate.And(EF.AllocationAmountsFact.HasWaterSourceTypes(searchCriteria.WaterSourceTypes.ToList()));
            }

            if (searchCriteria?.States != null && searchCriteria.States.Any())
            {
                predicate.And(EF.AllocationAmountsFact.HasOrganizationStates(searchCriteria.States.ToList()));
            }

            if (!string.IsNullOrWhiteSpace(searchCriteria?.PodOrPou))
            {
                predicate.And(EF.AllocationAmountsFact.IsPodOrPou(searchCriteria.PodOrPou));
            }

            return predicate;
        }

        private static ExpressionStarter<EF.AllocationAmountsFact> BuildGeometrySearchPredicate(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<EF.AllocationAmountsFact>(true);

            if (searchCriteria?.FilterGeometry != null)
            {
                predicate.And(EF.AllocationAmountsFact.IsWithinGeometry(searchCriteria.FilterGeometry));
            }

            return predicate;
        }

        public Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId)
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
                .SingleOrDefaultAsync();
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

        public async Task<List<AllocationAmount>> GetAllWaterAllocations()
        {
            using var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            var waterAllocations = await db.AllocationAmountsFact
                .ProjectTo<AllocationAmount>(DtoMapper.Configuration)
                .ToListAsync();

            return waterAllocations;
        }

        public async Task<List<SiteLocation>> GetWaterRightSiteLocationsById(string allocationUuid)
        {
            using var db = _databaseContextFactory.Create();
            return await db.AllocationBridgeSitesFact
                .Where(x => x.AllocationAmount.AllocationUuid == allocationUuid)
                .Select(x => x.Site)
                .Where(x => x.Longitude.HasValue && x.Latitude.HasValue)
                .ProjectTo<SiteLocation>(DtoMapper.Configuration)
                .ToListAsync();
        }

        public async Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid)
        {
            await using var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationBridgeSitesFact.Any(y => y.Site.SiteUuid == siteUuid))
                .ProjectTo<WaterRightsDigest>(DtoMapper.Configuration)
                .ToListAsync();
        }

        public int GetWaterRightsCount(WaterRightsSearchCriteria searchCriteria)
        {
            using var ts = new TransactionScope(TransactionScopeOption.Required, TransactionScopeAsyncFlowOption.Enabled);
            using var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var count = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate)
                .Count();

            ts.Complete();

            return count;
        }

        private async IAsyncEnumerable<WaterAllocations> BuildWaterAllocationsModel(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, allocationAmountsFacts) = GetFilteredWaterAllocations(searchCriteria);

            var allSiteAllocationsTask = GetSitesForAllocations(searchCriteria);

            var allBeneficialUses = await GetBeneficialUsesForAllocations(searchCriteria);
            // run both calls, then await first call before continuing
            var allSiteAllocations = await allSiteAllocationsTask;

            var waterAllocations = allocationAmountsFacts
                .ProjectTo<WaterAllocationsHelper>(DtoMapper.Configuration)
                .AsAsyncEnumerable();
            await foreach (var allocation in waterAllocations)
            {
                allocation.SiteUuid = string.Join(",", allSiteAllocations.GetValueOrDefault(allocation.AllocationAmountId) ?? new ConcurrentBag<string>());
                allocation.BeneficialUseCategory = string.Join(",", allBeneficialUses.GetValueOrDefault(allocation.AllocationAmountId) ?? new ConcurrentBag<string>());
                yield return allocation.Map<WaterAllocations>();
            }
        }

        private async IAsyncEnumerable<Sites> BuildSitesModel(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            var allRegulatoryTask = GetRegulatoryOverlayForSites(searchCriteria);

            var allWaterSourceUUIDS = await GetWaterSourcesForSites(searchCriteria);
            // run both calls, then await first call before continuing
            var allRegulatory = await allRegulatoryTask;

            var sites = filteredSites
                .ProjectTo<SitesHelper>(DtoMapper.Configuration)
                .AsAsyncEnumerable();

            await foreach (var site in sites)
            {
                site.WaterSourceUuids = string.Join(",", allWaterSourceUUIDS.GetValueOrDefault(site.SiteId) ?? new ConcurrentBag<string>());
                site.RegulatoryOverlayUuids = string.Join(",", allRegulatory.GetValueOrDefault(site.SiteId) ?? new ConcurrentBag<string>());
                yield return site.Map<Sites>();
            }
        }

        public IEnumerable<(string Name, IEnumerable<object> Data)> GetWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            var variables = GetVariables(searchCriteria);
            var organizations = GetOrganizations(searchCriteria);
            var methods = GetMethods(searchCriteria);
            var podtopou = GetPodSiteToPouSiteRelationships(searchCriteria);
            var waterSources = GetWaterSources(searchCriteria);
            var waterRights = BuildWaterAllocationsModel(searchCriteria).ToEnumerable();
            var sites = BuildSitesModel(searchCriteria).ToEnumerable();

            yield return ("WaterSources", waterSources);
            yield return ("Sites", sites);
            yield return ("Variables", variables);
            yield return ("Organizations", organizations);
            yield return ("Methods", methods);
            yield return ("WaterAllocations", waterRights);
            yield return ("PodSiteToPouSiteRelationships", podtopou);
        }

        internal IEnumerable<WaterSources> GetWaterSources(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            return db.WaterSourcesDim
                .AsNoTracking()
                .Where(a => filteredSites
                    .SelectMany(y => y.WaterSourceBridgeSitesFact)
                    .Any(x => x.WaterSourceId == a.WaterSourceId))
                .ProjectTo<WaterSources>(DtoMapper.Configuration)
                .AsEnumerable();
        }

        private IEnumerable<PodSiteToPouSiteRelationships> GetPodSiteToPouSiteRelationships(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, filteredSites) = GetFilteredSites(searchCriteria);

            return db.PODSiteToPOUSiteFact
                .AsNoTracking()
                .Where(a => filteredSites.Any(b => b.SiteId == a.PODSiteId)
                            || filteredSites.Any(b => b.SiteId == a.POUSiteId))
                .ProjectTo<PodSiteToPouSiteRelationships>(DtoMapper.Configuration)
                .AsEnumerable();
        }

        internal IEnumerable<Methods> GetMethods(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetFilteredWaterAllocations(searchCriteria);

            return db.MethodsDim
                .AsNoTracking()
                .Where(a => waterRightDetails
                    .Any(x => x.MethodId == a.MethodId))
                .ProjectTo<Methods>(DtoMapper.Configuration)
                .AsEnumerable();
        }

        internal IEnumerable<Organizations> GetOrganizations(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetFilteredWaterAllocations(searchCriteria);

            return db.OrganizationsDim
                .AsNoTracking()
                .Where(a => waterRightDetails
                    .Any(x => x.OrganizationId == a.OrganizationId))
                .ProjectTo<Organizations>(DtoMapper.Configuration)
                .AsEnumerable();
        }

        internal IEnumerable<Variables> GetVariables(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetFilteredWaterAllocations(searchCriteria);

            return db.VariablesDim
                .AsNoTracking()
                .Where(a => waterRightDetails
                    .Any(x => x.VariableSpecificId == a.VariableSpecificId))
                .ProjectTo<Variables>(DtoMapper.Configuration)
                .AsEnumerable();
        }

        private (DatabaseContext DB, IQueryable<EF.AllocationAmountsFact> AllocationAmounts) GetFilteredWaterAllocations(WaterRightsSearchCriteria searchCriteria)
        {
            var db = _databaseContextFactory.Create();

            // db.database does not pick up transaction from transactionScope if we do not open connection
            db.Database.OpenConnection();
            db.Database.SetCommandTimeout(_performanceConfiguration.DownloadCommandTimeout);
            var predicate = BuildWaterRightsSearchPredicate(searchCriteria, db);

            var waterRightDetails = db.AllocationAmountsFact
                .AsNoTracking()
                .Where(predicate);

            return (db, waterRightDetails);
        }

        private (DatabaseContext DB, IQueryable<EF.SitesDim> FilteredSites) GetFilteredSites(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, waterRightDetails) = GetFilteredWaterAllocations(searchCriteria);

            var sites = db.SitesDim
                .AsNoTracking()
                .Where(a => a.AllocationBridgeSitesFact
                    .Any(c => waterRightDetails
                        .Any(d => d.AllocationAmountId == c.AllocationAmountId)));

            return (db, sites);
        }

        private async Task<ConcurrentDictionary<long, ConcurrentBag<string>>> GetBeneficialUsesForAllocations(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, allocationAmountsFacts) = GetFilteredWaterAllocations(searchCriteria);
            var matchingBeneficialUses = db.AllocationBridgeBeneficialUsesFact
                .AsNoTracking()
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
            var (db, allocationAmountsFacts) = GetFilteredWaterAllocations(searchCriteria);
            var matchingSites = db.AllocationBridgeSitesFact
                .AsNoTracking()
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

        private async Task<ConcurrentDictionary<long, ConcurrentBag<string>>> GetRegulatoryOverlayForSites(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, sites) = GetFilteredSites(searchCriteria);
            var matchingRegulatoryUUIDS = db.RegulatoryOverlayBridgeSitesFact
                .AsNoTracking()
                .Where(a => sites.Any(b => b.SiteId == a.SiteId))
                .Select(a => new { a.SiteId, a.RegulatoryOverlay.RegulatoryOverlayUuid })
                .AsAsyncEnumerable();

            var allRegulatoryUuids = new ConcurrentDictionary<long, ConcurrentBag<string>>();
            await Parallel.ForEachAsync(matchingRegulatoryUUIDS, (regulatoryUUID, ct) =>
            {
                allRegulatoryUuids.GetOrAdd(regulatoryUUID.SiteId, new ConcurrentBag<string>())
                    .Add(regulatoryUUID.RegulatoryOverlayUuid);
                return ValueTask.CompletedTask;
            });
            return allRegulatoryUuids;
        }
        
        public async Task<OverlayDetails> GetOverlayDetails(string overlayUuid)
        {
            await using var db = _databaseContextFactory.Create();
            await db.Database.OpenConnectionAsync();

            var overlay = await db.ReportingUnitsDim
                .Include(r => r.RegulatoryReportingUnitsFact)
                .ThenInclude(rr => rr.Organization)
                .AsNoTracking()
                .Where(r => r.ReportingUnitUuid == overlayUuid)
                .ProjectTo<OverlayDetails>(DtoMapper.Configuration)
                .SingleOrDefaultAsync();

            return overlay;
        }

        public async Task<List<OverlayTableEntry>> GetOverlayInfoById(string reportingUnitUuid)
        {
            await using var db = _databaseContextFactory.Create();
            await db.Database.OpenConnectionAsync();

            var entries = await db.RegulatoryOverlayDim
                .AsNoTracking()
                .Where(ro => ro.RegulatoryReportingUnitsFact
                    .Any(rr => rr.ReportingUnit.ReportingUnitUuid == reportingUnitUuid))
                .ProjectTo<OverlayTableEntry>(DtoMapper.Configuration)
                .ToListAsync();

            return entries;
        }

        private async Task<ConcurrentDictionary<long, ConcurrentBag<string>>> GetWaterSourcesForSites(WaterRightsSearchCriteria searchCriteria)
        {
            var (db, sites) = GetFilteredSites(searchCriteria);
            var matchingWaterSourceUUIDs = db.WaterSourceBridgeSitesFact
                .AsNoTracking()
                .Where(a => sites.Any(b => b.SiteId == a.SiteId))
                .Select(a => new { a.SiteId, a.WaterSource.WaterSourceUuid })
                .AsAsyncEnumerable();

            var allRegulatoryUuids = new ConcurrentDictionary<long, ConcurrentBag<string>>();
            await Parallel.ForEachAsync(matchingWaterSourceUUIDs, (waterSource, ct) =>
            {
                allRegulatoryUuids.GetOrAdd(waterSource.SiteId, new ConcurrentBag<string>())
                    .Add(waterSource.WaterSourceUuid);
                return ValueTask.CompletedTask;
            });
            return allRegulatoryUuids;
        }
    }
}
