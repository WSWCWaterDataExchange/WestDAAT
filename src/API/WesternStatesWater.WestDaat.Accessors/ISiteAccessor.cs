using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISiteAccessor : IServiceContractBase
    {
        SitesDim GetWaterAllocationSiteDetailsById(string id);
    }
}
