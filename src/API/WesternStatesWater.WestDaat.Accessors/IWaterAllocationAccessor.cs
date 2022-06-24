using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria accessorSearchRequest);

        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);

        Task<WaterRightDetails> GetWaterRightDetailsById(long waterRightId);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(long waterRightId);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(long waterRightId);

        Task<List<AllocationAmount>> GetAllWaterAllocations();

        Task<List<SiteLocation>> GetWaterRightSiteLocationsById(long waterRightId);

        Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid);
    }
}