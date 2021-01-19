using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapboxPrototypeAPI.Accessors
{
    public class WaterAllocationAccessor : IWaterAllocationAccessor
    {
        private readonly WaDE_QA_ServerContext _dbContext;

        public WaterAllocationAccessor(WaDE_QA_ServerContext dbContext)
        {
            _dbContext = dbContext;
        }

        public SitesDim GetSiteById(int id)
        {
            return _dbContext.SitesDims.FirstOrDefault(x => x.SiteId == id);
        }

        public IEnumerable<AllocationAmountsFact> GetWaterAllocationDataById(IEnumerable<long> ids)
        {
            var allocations = _dbContext.AllocationAmountsFacts
                .Where(x => ids.Contains(x.AllocationAmountId))
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.Site)
                .Include(x => x.AllocationBridgeBeneficialUsesFacts).ThenInclude(x => x.BeneficialUseCvNavigation)
                .Include(x => x.Organization)
                .Include(x => x.WaterSource)
                .Include(x => x.VariableSpecific)
                .Include(x => x.AllocationExpirationDate)
                .ToList();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var sites = allocation.AllocationBridgeSitesFacts.Select(x => x.Site).ToList();

                foreach (var site in sites)
                {
                    if (beneficialUse == null)
                        allocation.AllocationBridgeBeneficialUsesFacts
                            .Add(new AllocationBridgeBeneficialUsesFact() { BeneficialUseCvNavigation = new BeneficialUse() { WaDename = "Unknown" } });
                }
            }

            return allocations;
        }

        public IEnumerable<AllocationAmountsFact> GetAllocations()
        {
            var allocations = _dbContext.AllocationAmountsFacts
                .Include(x => x.AllocationBridgeSitesFacts).ThenInclude(x => x.Site)
                .Include(x => x.AllocationBridgeBeneficialUsesFacts).ThenInclude(x => x.BeneficialUseCvNavigation)
                .Include(x => x.WaterSource)
                .Include(x => x.AllocationPriorityDate)
                .ToList();

            foreach (var allocation in allocations)
            {
                var beneficialUse = allocation.AllocationBridgeBeneficialUsesFacts.FirstOrDefault();
                var sites = allocation.AllocationBridgeSitesFacts.Select(x => x.Site).ToList();

                foreach (var site in sites)
                {
                    if (beneficialUse == null)
                        allocation.AllocationBridgeBeneficialUsesFacts
                            .Add(new AllocationBridgeBeneficialUsesFact() { BeneficialUseCvNavigation = new BeneficialUse() { WaDename = "Unknown" } });
                }
            }

            return allocations;
        }
    }
}
