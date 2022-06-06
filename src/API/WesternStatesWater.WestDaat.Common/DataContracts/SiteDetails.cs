namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class SiteDetails
    {
        public string SiteUuid { get; set; }
        public string SiteNativeId { get; set; }
        public string SiteName { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string County { get; set; }
        public string PodOrPou { get; set; }
        public string SiteType { get; set; }
    }
}
