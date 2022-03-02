using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;
using System.Linq;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Accessors
{
    public class SiteAccessor : AccessorBase, ISiteAccessor
    {
        public SiteAccessor(ILogger<TestAccessor> logger) : base(logger)
        {
        }

        public SitesDim GetWaterAllocationSiteDetailsById(string siteUuid)
        {
            var siteData = UsingDatabaseContext<SitesDim>(db =>
            {
                return db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .Include(x => x.WaterSourceBridgeSitesFact)
                    .Include(x => x.SiteVariableAmountsFact)
                    .Include(x => x.AllocationBridgeSitesFact).ThenInclude(x => x.AllocationAmount)
                    .ThenInclude(x => x.Organization)
                    .Include(x => x.AllocationBridgeSitesFact).ThenInclude(x => x.AllocationAmount)
                    .ThenInclude(x => x.AllocationBridgeBeneficialUsesFact)
                    .ThenInclude(x => x.BeneficialUse)
                    .FirstOrDefault();
            });

            return siteData;
        }
    }
}