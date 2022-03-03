using GeoJSON.Text.Feature;

using WesternStatesWater.WestDaat.Common.Contracts;


namespace WesternStatesWater.WestDaat.Accessors

{
    public interface INldiAccessor

    {

        Task<FeatureCollection> GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints);

    }

}
