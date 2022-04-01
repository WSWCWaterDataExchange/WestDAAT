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
                    ArkansasRiverBasin.BasinName,
                    BearRiverBasin.BasinName,
                    ColoradoRiverBasin.BasinName,
                    ColumbiaRiverBasin.BasinName,
                    KlamathRiverBasin.BasinName,
                    MissouriRiverBasin.BasinName,
                    PecosRiverBasin.BasinName,
                    RioGrandeRiverBasin.BasinName,
                    SacramentoSanJoaquinRiverBasin.BasinName,
                    TruckeeCarsonRiverBasin.BasinName,
                };
            }
        }

        public static Dictionary<string, Feature> RiverBasinDictionary
        {
            get
            {
                return new Dictionary<string, Feature>
                {
                    {ArkansasRiverBasin.BasinName, ArkansasRiverBasin.Feature },
                    {BearRiverBasin.BasinName, BearRiverBasin.Feature },
                    {ColoradoRiverBasin.BasinName, ColoradoRiverBasin.Feature },
                    {ColumbiaRiverBasin.BasinName, ColumbiaRiverBasin.Feature },
                    {KlamathRiverBasin.BasinName, KlamathRiverBasin.Feature },
                    {MissouriRiverBasin.BasinName, MissouriRiverBasin.Feature },
                    {PecosRiverBasin.BasinName, PecosRiverBasin.Feature },
                    {RioGrandeRiverBasin.BasinName, RioGrandeRiverBasin.Feature },
                    {SacramentoSanJoaquinRiverBasin.BasinName, SacramentoSanJoaquinRiverBasin.Feature },
                    {TruckeeCarsonRiverBasin.BasinName, TruckeeCarsonRiverBasin.Feature },
                };
            }
        }
    }
}
