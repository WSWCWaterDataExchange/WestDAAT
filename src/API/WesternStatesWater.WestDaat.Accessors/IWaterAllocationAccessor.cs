using System.IO;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Task<WaterRightsSearchResults> FindWaterRights(WaterRightsSearchCriteria accessorSearchRequest);

        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);

        Task<WaterRightDetails> GetWaterRightDetailsById(string allocationUuid);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(string allocationUuid);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(string allocationUuid);

        Task<List<AllocationAmount>> GetAllWaterAllocations();

        Task<List<SiteLocation>> GetWaterRightSiteLocationsById(string allocationUuid);

        Task<List<WaterRightsDigest>> GetWaterRightsDigestsBySite(string siteUuid);

        Task<int> GetWaterRightsCount(WaterRightsSearchCriteria accessorSearchRequest);

        Task<Stream> GetWaterRightsZip(WaterRightsSearchCriteria accessorSearchRequest);
    }
}