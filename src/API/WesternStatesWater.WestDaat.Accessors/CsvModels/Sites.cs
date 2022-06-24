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
        public string EPSGCodeCV { get; set; }
        public Geometry Geometry { get; set; }
        public string GNISCodeCV { get; set; }
        public string HUC12 { get; set; }
        public string HUC8 { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string NHDNetworkStatusCV { get; set; }
        public string NHDProductCV { get; set; }
        public string PODorPOUSite { get; set; }
        public string SiteName { get; set; }
        public string SiteNativeID { get; set; }
        public string ID { get; set; }
        public Geometry SitePoint { get; set; }
        public string SiteTypeCV { get; set; }
        public string StateCV { get; set; }
        public string USGSSiteID { get; set; }
    }
}
