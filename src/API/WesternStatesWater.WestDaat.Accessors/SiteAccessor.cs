using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Extensions.Logging;
using System.Linq;
using AutoMapper.QueryableExtensions;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public class SiteAccessor : AccessorBase, ISiteAccessor
    {
        public SiteAccessor(ILogger<SiteAccessor> logger) : base(logger)
        {
        }

        public Site GetSiteByUuid(string siteUuid)
        {
            var site = UsingDatabaseContext<Site>(db =>
            {
                return db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .ProjectTo<Site>(DTOMapper.Configuration)
                    .Single();
            });

            return site;
        }
    }
}