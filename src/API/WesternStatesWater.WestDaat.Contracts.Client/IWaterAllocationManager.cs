using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface IWaterAllocationManager : IServiceContractBase
    {
        string GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid);
    }
}
