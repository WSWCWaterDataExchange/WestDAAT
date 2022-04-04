using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Constants;

namespace WesternStatesWater.WestDaat.Engines
{
    public class LocationEngine : EngineBase, ILocationEngine
    {
        public LocationEngine(ILogger<LocationEngine> logger) : base(logger) { }

        public List<string> GetRiverBasinNames()
        {
            return RiverBasinConstants.RiverBasinNames;
        }

        public FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames)
        {
            var features = RiverBasinConstants.RiverBasinDictionary.Where(x => basinNames.Contains(x.Key)).Select(x => x.Value).ToList();
            return new FeatureCollection(features);
        }
    }
}
