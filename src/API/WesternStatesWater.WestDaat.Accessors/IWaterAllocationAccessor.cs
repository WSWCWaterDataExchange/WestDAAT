using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);

        Task<WaterRightDetails> GetWaterRightDetailsById(long waterRightId);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoById(long waterRightId);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoById(long waterRightId);
    }
}