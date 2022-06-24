using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class WaterSources
    {
        public string WaterSourceUUID { get; set; }
        public Geometry Geometry { get; set; }
        public string GNISFeatureNameCV { get; set; }
        public string WaterQualityIndicatorCV { get; set; }
        public string WaterSourceName { get; set; }
        public string WaterSourceNativeID { get; set; }
        public string WaterSourceTypeCV { get; set; }
    }
}
