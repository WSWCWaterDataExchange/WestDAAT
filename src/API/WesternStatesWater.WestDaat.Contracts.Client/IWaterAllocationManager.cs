using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface IWaterAllocationManager : IServiceContractBase
    {
        string GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid);
        
        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);

        Task<string> GetWaterAllocationAmountsGeoJson();
    }
}
