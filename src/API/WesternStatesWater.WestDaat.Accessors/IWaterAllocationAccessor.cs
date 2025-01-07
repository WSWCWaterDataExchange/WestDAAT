using NetTopologySuite.Geometries;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Task<AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(WaterRightsSearchCriteria searchCriteria, AnalyticsInformationGrouping groupValue);

        Task<Geometry> GetWaterRightsEnvelope(WaterRightsSearchCriteria accessorRequest);

        Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria accessorSearchRequest, int pageNumber);

        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);

        Task<WaterRightDetails> GetWaterRightDetailsById(string allocationUuid);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(string allocationUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(string allocationUuid);

        Task<List<AllocationAmount>> GetAllWaterAllocations();

        Task<List<SiteLocation>> GetWaterRightSiteLocationsById(string allocationUuid);

        Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid);

        int GetWaterRightsCount(WaterRightsSearchCriteria accessorSearchRequest);

        IEnumerable<(string Name, IEnumerable<object> Data)> GetWaterRights(WaterRightsSearchCriteria accessorSearchRequest);
        
        Task<OverlayDetails> GetOverlayDetails(string overlayUuid);
        
        Task<List<OverlayTableEntry>> GetOverlayInfoById(OverlayDetailsSearchCriteria searchCriteria);
    }
}