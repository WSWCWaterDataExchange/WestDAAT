using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class SiteAccessor : AccessorBase, ISiteAccessor
    {
        public SiteAccessor(ILogger<SiteAccessor> logger, IDatabaseContextFactory databaseContextFactory) : base(logger)
        {
            _databaseContextFactory = databaseContextFactory;
        }

        private readonly IDatabaseContextFactory _databaseContextFactory;

        async Task<Site> ISiteAccessor.GetSiteByUuid(string siteUuid)
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .ProjectTo<Site>(DtoMapper.Configuration)
                    .SingleAsync();
            }
        }

        async Task<List<Site>> ISiteAccessor.GetSites()
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.SitesDim
                    .ProjectTo<Site>(DtoMapper.Configuration)
                    .ToListAsync();
            }
        }

        public async Task<SiteDetails> GetSiteDetailsByUuid(string siteUuid)
        {
            using (var db = _databaseContextFactory.Create())
            {
                return await db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .ProjectTo<SiteDetails>(DtoMapper.Configuration)
                    .SingleAsync();
            }
        }
    }
}