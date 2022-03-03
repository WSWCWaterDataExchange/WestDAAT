using GeoJSON.Text.Feature;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IUsgsNldiSdk
    {
        Task<FeatureCollection> GetFeatureByCoordinates(double latitude, double longitude);
        Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm);
        Task<FeatureCollection> GetFeatures(string comid, NavigationMode navigationMode, FeatureDataSource featureDataSource, int distanceInKm);
    }
}
