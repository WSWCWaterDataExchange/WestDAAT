using NetTopologySuite.Geometries;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using AnalyticsSummaryInformation = WesternStatesWater.WestDaat.Common.DataContracts.AnalyticsSummaryInformation;
using OverlayDetails = WesternStatesWater.WestDaat.Common.DataContracts.OverlayDetails;
using OverlayDetailsSearchCriteria = WesternStatesWater.WestDaat.Common.DataContracts.OverlayDetailsSearchCriteria;
using OverlayDigest = WesternStatesWater.WestDaat.Common.DataContracts.OverlayDigest;
using OverlayTableEntry = WesternStatesWater.WestDaat.Common.DataContracts.OverlayTableEntry;
using SiteInfoListItem = WesternStatesWater.WestDaat.Common.DataContracts.SiteInfoListItem;
using SiteUsageListItem = WesternStatesWater.WestDaat.Common.DataContracts.SiteUsageListItem;
using WaterRightDetails = WesternStatesWater.WestDaat.Common.DataContracts.WaterRightDetails;
using WaterRightsSearchCriteria = WesternStatesWater.WestDaat.Common.DataContracts.WaterRightsSearchCriteria;
using WaterRightsSearchResults = WesternStatesWater.WestDaat.Common.DataContracts.WaterRightsSearchResults;
using WaterSourceInfoListItem = WesternStatesWater.WestDaat.Common.DataContracts.WaterSourceInfoListItem;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Task<AnalyticsSummaryInformation[]> GetAnalyticsSummaryInformation(WaterRightsSearchCriteria searchCriteria, AnalyticsInformationGrouping groupValue);

        Task<Geometry> GetWaterRightsEnvelope(WaterRightsSearchCriteria accessorRequest);

        Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria accessorSearchRequest, int pageNumber);
        
        Task<IEnumerable<SiteUsageListItem>> GetRightUsageInfoListByAllocationUuid(string allocationUuid);

        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);

        Task<WaterRightDetails> GetWaterRightDetailsById(string allocationUuid);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(string allocationUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(string allocationUuid);

        Task<List<AllocationAmount>> GetAllWaterAllocations();

        Task<List<SiteLocation>> GetWaterRightSiteLocationsById(string allocationUuid);

        int GetWaterRightsCount(WaterRightsSearchCriteria accessorSearchRequest);

        IEnumerable<(string Name, IEnumerable<object> Data)> GetWaterRights(WaterRightsSearchCriteria accessorSearchRequest);
        
        Task<OverlayDetails> GetOverlayDetails(string overlayUuid);
        
        Task<List<OverlayTableEntry>> GetOverlayInfoById(OverlayDetailsSearchCriteria searchCriteria);
        
        Task<List<OverlayDigest>> GetOverlayDigestsByUuid(string overlayUuid);
    }
}