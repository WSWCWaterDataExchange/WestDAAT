using AutoMapper.QueryableExtensions;
using LinqKit;
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
        

        public async Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria searchCriteria)
        {
            var predicate = PredicateBuilder.New<AllocationAmountsFact>(true);

            if(searchCriteria?.BeneficialUses != null && searchCriteria.BeneficialUses.Any())
            {
                predicate = predicate.And(AllocationAmountsFact.HasBeneficialUses(searchCriteria.BeneficialUses.ToList()));
            }

            if(searchCriteria?.OwnerClassifications != null && searchCriteria.OwnerClassifications.Any())
            {
                predicate.And(AllocationAmountsFact.HasOwnerClassification(searchCriteria.OwnerClassifications.ToList()));
            }
            
            if(searchCriteria?.WaterSourceTypes != null && searchCriteria.WaterSourceTypes.Any())
            {
                predicate.And(AllocationAmountsFact.HasWaterSourceTypes(searchCriteria.WaterSourceTypes.ToList()));
            }

            using var db = _databaseContextFactory.Create();
            var waterRightDetails = await db.AllocationAmountsFact
                .Include(x => x.AllocationBridgeBeneficialUsesFact)
                .Include(x => x.AllocationBridgeSitesFact)
                .Where(predicate)
                .Select(x => new WaterRightsSearchDetail
                {
                    SiteUUIDs = x.AllocationBridgeSitesFact.Select(abs => abs.Site.SiteUuid).ToArray(),
                    AllocationNativeID = x.AllocationNativeId,
                    BeneficialUses = x.AllocationBridgeBeneficialUsesFact.Select(b => b.BeneficialUse.WaDEName.Length > 0 ? b.BeneficialUse.WaDEName : b.BeneficialUse.Name).ToArray(),
                    OwnerClassification = x.OwnerClassification.WaDEName.Length > 0 ? x.OwnerClassification.WaDEName : x.OwnerClassification.Name
                })
                .ToArrayAsync();

            //using var db = _databaseContextFactory.Create();
            //var waterRightDetails = await db.AllocationAmountsFact
            //    .Include(x => x.AllocationBridgeBeneficialUsesFact)
            //    .Where(x => x.AllocationBridgeBeneficialUsesFact.Any(b => 
            //        beneficalUsesList.Contains(b.BeneficialUse.WaDEName)))
            //    .Select(x => new WaterRightsSearchDetail
            //    {
            //        BeneficialUses = x.AllocationBridgeBeneficialUsesFact.Select(b => b.BeneficialUse.WaDEName).ToArray()
            //    })
            //    .ToArrayAsync();

            return new WaterRightsSearchResults
            {
                CurrentPageNumber = 1,
                WaterRightsDetails = waterRightDetails
            };
        }

        //private static ExpressionStarter<AllocationAmountsFact> HasBeneficialUses(List<string> beneficalUsesList)
        //{
        //    var predicate = PredicateBuilder.New<AllocationAmountsFact>();

        //    predicate = predicate.Or(x => x.AllocationBridgeBeneficialUsesFact.Any(b =>
        //            beneficalUsesList.Contains(b.BeneficialUse.WaDEName)));
        //    return predicate;
        //}

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
                        .Where(x => x.Longitude.HasValue && x.Latitude.HasValue)
                        .ProjectTo<SiteLocation>(DtoMapper.Configuration)
                        .ToListAsync();
        }

        async Task<List<WaterRightsDigest>> IWaterAllocationAccessor.GetWaterRightsDigestsBySite(string siteUuid)
        {
            using var db = _databaseContextFactory.Create();
            db.Database.SetCommandTimeout(int.MaxValue);
            return await db.AllocationAmountsFact
                .Where(x => x.AllocationBridgeSitesFact.Any(y=>y.Site.SiteUuid == siteUuid))
                .ProjectTo<WaterRightsDigest>(DtoMapper.Configuration)
                .ToListAsync();
        }
    }

}
