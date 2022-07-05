namespace WesternStatesWater.WestDaat.Accessors.CsvModels
{
    public class PodSiteToPouSiteRelationships
    {
        public long PODSiteUuid { get; set; }
        public long POUSiteUuid { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
