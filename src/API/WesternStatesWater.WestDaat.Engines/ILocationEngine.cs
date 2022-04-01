using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines
{
    public interface ILocationEngine : IServiceContractBase
    {
        public List<string> GetRiverBasinNames();

        public FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames);
    }
}
