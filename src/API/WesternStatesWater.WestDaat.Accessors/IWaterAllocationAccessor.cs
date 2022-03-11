using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface IWaterAllocationAccessor : IServiceContractBase
    {
        Organization GetWaterAllocationAmountOrganizationById(long allocationAmountId);
        Task<List<AllocationAmount>> GetAllWaterAllocations();
    }
}