using GeoJSON.Text.Feature;
using System.IO;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface IWaterAllocationManager : IServiceContractBase
    {
        Task<AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(WaterRightsSearchCriteria searchRequest);

        Task<FeatureCollection> GetWaterRightsEnvelope(WaterRightsSearchCriteria searchRequest);

        Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteriaWithPaging searchRequest);

        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);

        Task<WaterRightDetails> GetWaterRightDetails(string allocationUuid);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoList(string allocationUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoList(string allocationUuid);

        Task<FeatureCollection> GetWaterRightSiteLocations(string allocationUuid);

        Task<string> GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid);

        Task<SiteDetails> GetSiteDetails(string siteUuid);

        Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid);

        Task<SiteDigest> GetSiteDigest(string siteUuid);

        Task<Feature> GetWaterSiteLocation(string siteUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterSiteSourceInfoListByUuid(string siteUuid);

        Task<List<WaterRightInfoListItem>> GetWaterSiteRightsInfoListByUuid(string siteUuid);

        Task WaterRightsAsZip(Stream responseStream, WaterRightsSearchCriteriaWithFilterUrl searchRequest);

        Task<SiteUsage> GetSiteUsageBySiteUuid(string siteUuid);

        Task<List<VariableInfoListItem>> GetSiteVariableInfoListByUuid(string siteUuid);
        
        Task<OverlayDetails> GetOverlayDetails(string overlayUuid);
        
        Task<List<OverlayTableEntry>> GetOverlayInfoById(string reportingUnitUuid);
        
        Task<List<MethodInfoListItem>> GetSiteMethodInfoListByUuid(string siteUuid);
    }
}
