using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class Sites
    {
        public string SiteUuid { get; set; }
        public string Regulatory { get; set; }
        public string WaterSourceUuids { get; set; }
        public string CoordinateAccuracy { get; set; }
        public string CoordinateMethodCv { get; set; }
        public string County { get; set; }
        public string EpsgCodeCv { get; set; }
        public string Geometry { get; set; }
        public string GnisCodeCv { get; set; }
        public string HUC12 { get; set; }
        public string HUC8 { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string NhdNetworkStatusCv { get; set; }
        public string NhdProductCv { get; set; }
        public string PODorPOUSite { get; set; }
        public string SiteName { get; set; }
        public string SiteNativeId { get; set; }
        public string ID { get; set; }
        public string SitePoint { get; set; }
        public string SiteTypeCv { get; set; }
        public string StateCv { get; set; }
        public string UsgsSiteId { get; set; }
    }
}
