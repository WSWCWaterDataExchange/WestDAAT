using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public class Site
    {
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string HUC8 { get; set; }
        public string HUC12 { get; set; }
        public string County { get; set; }
        public string SiteTypeCv { get; set; }
        public string SiteUuid { get; set; }
        public string GniscodeCv { get; set; }
        public string SiteName { get; set; }
        public Geometry Geometry { get; set; }

        public List<long> AllocationIds { get; set; }
    }
}