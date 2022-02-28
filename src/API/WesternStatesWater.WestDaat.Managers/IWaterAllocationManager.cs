using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Managers
{
    public interface IWaterAllocationManager : IServiceContractBase
    {
        string GetWaterAllocationSiteDetailsById(string siteUuid);
    }
}
