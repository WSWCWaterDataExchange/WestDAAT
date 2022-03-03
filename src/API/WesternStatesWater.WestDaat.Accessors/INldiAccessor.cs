using GeoJSON.Text.Feature;
using System.Threading.Tasks;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface INldiAccessor
    {
        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);
    }
}
