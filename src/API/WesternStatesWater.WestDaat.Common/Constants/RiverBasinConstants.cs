using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common.Constants.RiverBasins;

namespace WesternStatesWater.WestDaat.Common.Constants
{
    public static class RiverBasinConstants
    {
        public static List<string> RiverBasinNames
        {
            get
            {
                return new List<string>
                {
                    BearRiverBasin.BasinName,
                    ColoradoRiverBasin.BasinName,
                };
            }
        }

        public static Dictionary<string, Feature> RiverBasinDictionary
        {
            get
            {
                return new Dictionary<string, Feature>
                {
                    {BearRiverBasin.BasinName, BearRiverBasin.Feature },
                    {ColoradoRiverBasin.BasinName, ColoradoRiverBasin.Feature },
                };
            }
        }

        public static Dictionary<string, Feature> RiverBasinDictionaryLite
        {
            get
            {
                return new Dictionary<string, Feature>
                {
                    {BearRiverBasinLite.BasinName, BearRiverBasinLite.Feature },
                    {ColoradoRiverBasinLite.BasinName, ColoradoRiverBasinLite.Feature },
                };
            }
        }
    }
}
