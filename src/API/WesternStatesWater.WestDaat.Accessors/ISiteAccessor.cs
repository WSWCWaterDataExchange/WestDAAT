using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISiteAccessor : IServiceContractBase
    {
        Site GetSiteByUuid(string siteUuid);
    }
}
