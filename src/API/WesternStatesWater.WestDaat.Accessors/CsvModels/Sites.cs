using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class Sites
    {
        public string SiteUUID { get; set; }
        public string Regulatory { get; set; }
        public string WaterSourceUUIDs { get; set; }
        public string CoordinateAccuracy { get; set; }
        public string CoordinateMEthodCV { get; set; }
        public string County { get; set; }
        public string EPSGCode { get; set; }
        public Geometry Geometry { get; set; }
        public string GNISCode { get; set; }
    }
}
