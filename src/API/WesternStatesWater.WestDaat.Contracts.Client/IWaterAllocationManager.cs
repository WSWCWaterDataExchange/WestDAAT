using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface IWaterAllocationManager : IServiceContractBase
    {
        Task<string> GetWaterAllocationSiteGeoconnexIntegrationData(string siteUuid);
        
        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);

        Task<SiteDetails> GetSiteDetails(string siteUuid);

        Task<WaterRightDetails> GetWaterRightDetails(long waterRightsId);

        Task<List<SiteInfoListItem>> GetWaterRightSiteInfoList(long waterRightsId);

        Task<List<WaterSourceInfoListItem>> GetWaterRightSourceInfoList(long waterRightsId);

        List<string> GetRiverBasinNames();

        List<Feature> GetRiverBasinPolygonByName(string[] basinNames);
    }
}
