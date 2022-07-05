using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class WaterSources
    {
        public string WaterSourceUuid { get; set; }
        public string Geometry { get; set; }
        public string GnisFeatureNameCv { get; set; }
        public string WaterQualityIndicatorCv { get; set; }
        public string WaterSourceName { get; set; }
        public string WaterSourceNativeId { get; set; }
        public string WaterSourceTypeCv { get; set; }
    }
}
