using GeoJSON.Text.Feature;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Utilities
{
    public interface IUsgsNldiSdk
    {
        Task<FeatureCollection> GetFeatureByCoordinates(double latitude, double longitude);
        Task<FeatureCollection> GetFlowlines(string comid, NavigationMode navigationMode, int distanceInKm);
    }
}
