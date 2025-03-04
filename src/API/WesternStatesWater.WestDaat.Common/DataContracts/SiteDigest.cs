namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class SiteDigest
    {
        public string SiteUuid { get; set; }
        public string SiteNativeId { get; set; }
        public string SiteName { get; set; }
        public string SiteType { get; set; }
        public bool HasTimeSeriesData { get; set; }
        public List<string> TimeSeriesVariableTypes { get; set; }
        public List<WaterRightsDigest> WaterRightsDigests { get; set; } = new List<WaterRightsDigest>();
    }
}