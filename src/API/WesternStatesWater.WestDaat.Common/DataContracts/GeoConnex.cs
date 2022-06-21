using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class GeoConnex
    {
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string SiteTypeCv { get; set; }
        public string SiteUuid { get; set; }
        public string SiteName { get; set; }
        public string OrganizationDataMappingUrl { get; set; }
    }
}
