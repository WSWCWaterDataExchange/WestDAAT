using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Engines
{
    public interface IGeoConnexEngine : IServiceContractBase
    {
        string BuildGeoConnexJson(Site site, Organization organization);
    }
}
