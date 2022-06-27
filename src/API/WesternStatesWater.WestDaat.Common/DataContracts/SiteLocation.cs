using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class SiteLocation
    {
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string SiteUuid { get; set; }
        public string PODorPOUSite { get; set; }
        public Geometry Geometry { get; set; }
    }
}
