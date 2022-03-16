namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class SiteInfoListItem
    {
        public string SiteUuid { get; set; }
        public string SiteNativeId { get; set; }
        public string SiteName { get; set; }
        public string SiteTypeCv { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string County { get; set; }
        public string PODorPOUSite { get; set; }
    }
}
