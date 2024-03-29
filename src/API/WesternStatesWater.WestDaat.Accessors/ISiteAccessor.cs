﻿using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISiteAccessor : IServiceContractBase
    {
        Task<Site> GetSiteByUuid(string siteUuid);
        Task<List<Site>> GetSites();

        Task<SiteDetails> GetSiteDetailsByUuid(string siteUuid);

        Task<SiteDigest> GetSiteDigestByUuid(string siteUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterSiteSourceInfoListByUuid(string siteUuid);

        Task<SiteLocation> GetWaterSiteLocationByUuid(string siteUuid);

        Task<List<WaterRightInfoListItem>> GetWaterRightInfoListByUuid(string siteUuid);

        IEnumerable<GeoConnex> GetJSONLDData();
    }
}
