using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Data;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Accessors.Mapping;
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

        public Task<SiteDetails> GetSiteDetailsByUuid(string siteUuid)
        {
            using (var db = _databaseContextFactory.Create())
            {
                return db.SitesDim
                    .Where(x => x.SiteUuid == siteUuid)
                    .ProjectTo<SiteDetails>(DtoMapper.Configuration)
                    .SingleAsync();
            }
        }
    }
}