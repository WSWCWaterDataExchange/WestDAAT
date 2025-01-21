using GeoJSON.Text.Feature;
using System.IO;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client;

/// <summary>
/// Defines operations for searching, viewing, and analyzing water rights, sites, allocations, 
/// and overlay data. Implementations of this interface are intended to support comprehensive 
/// data queries and provide insights into water resource management.
/// </summary>
public interface IWaterResourceManager : IServiceContractBase
{
    Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteriaWithPaging searchRequest);

    Task<AnalyticsSummaryInformationResponse> GetAnalyticsSummaryInformation(WaterRightsSearchCriteriaWithGrouping searchRequest);

    Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);

    Task<OverlayDetails> GetOverlayDetails(string overlayUuid);

    Task<List<OverlayTableEntry>> GetOverlayInfoById(OverlayDetailsSearchCriteria searchCriteria);

    FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames);

    Task<SiteDetails> GetSiteDetails(string siteUuid);

    Task<SiteDigest> GetSiteDigest(string siteUuid);

    Task<List<MethodInfoListItem>> GetSiteMethodInfoListByUuid(string siteUuid);

    Task<SiteUsage> GetSiteUsageBySiteUuid(string siteUuid);
    
    Task<List<SiteUsageListItem>> GetSiteUsageInfoListBySiteUuid(string siteUuid);

    Task<List<VariableInfoListItem>> GetSiteVariableInfoListByUuid(string siteUuid);

    Task<string> GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid);

    Task<WaterRightDetails> GetWaterRightDetails(string allocationUuid);

    Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid);

    Task<FeatureCollection> GetWaterRightsEnvelope(WaterRightsSearchCriteria searchRequest);

    Task<List<WaterRightInfoListItem>> GetWaterRightsInfoListByReportingUnitUuid(string reportingUnitUuid);

    Task<List<SiteInfoListItem>> GetWaterRightSiteInfoList(string allocationUuid);

    Task<FeatureCollection> GetWaterRightSiteLocations(string allocationUuid);

    Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoList(string allocationUuid);

    Task<Feature> GetWaterSiteLocation(string siteUuid);

    Task<List<WaterRightInfoListItem>> GetWaterSiteRightsInfoListByUuid(string siteUuid);

    Task<List<WaterSourceInfoListItem>> GetWaterSiteSourceInfoListByUuid(string siteUuid);

    Task<DashboardFilters> LoadFilters();

    Task WaterRightsAsZip(Stream responseStream, WaterRightsSearchCriteriaWithFilterUrl searchRequest);
    
    Task<List<OverlayDigest>> GetOverlayDigestsByUuid(string siteUuid);
}