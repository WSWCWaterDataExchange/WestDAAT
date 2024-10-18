using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISystemAccessor : IServiceContractBase
    {
        Task<DashboardFilters> LoadFilters();
    }
}