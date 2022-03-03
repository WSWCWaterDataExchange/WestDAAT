using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common.Contracts;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface IWaterAllocationManager
    {
        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);
    }
}
