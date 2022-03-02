using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common;
namespace WesternStatesWater.WestDaat.Engines
{
    public interface IGeoConnexEngine : IServiceContractBase
    {
        string BuildGeoconnexJson(SitesDim sitesDim);
    }
}
