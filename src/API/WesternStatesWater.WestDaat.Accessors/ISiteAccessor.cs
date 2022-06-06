using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISiteAccessor : IServiceContractBase
    {
        Task<Site> GetSiteByUuid(string siteUuid);
        Task<List<Site>> GetSites();

        Task<SiteDetails> GetSiteDetailsByUuid(string siteUuid);

        Task<SiteLocation> GetWaterSiteLocationByUuid(string siteUuid);

    }
}
