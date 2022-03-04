using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Extensions.Logging;
using System.Linq;
using AutoMapper.QueryableExtensions;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SiteAccessor : AccessorBase, ISiteAccessor
    {
        public SiteAccessor(ILogger<SiteAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        Site ISiteAccessor.GetSiteByUuid(string siteUuid)
        {
            using (var db = _databaseContextFactory.Create())
            {
                return db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .ProjectTo<Site>(DtoMapper.Configuration)
                    .Single();
            }
        }
    }
}