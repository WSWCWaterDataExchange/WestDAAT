namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class PODSiteToPOUSiteFact
    {
        public long PODSiteToPOUSiteId { get; set; }
        public long PODSiteId { get; set; }
        public long POUSiteId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public virtual SitesDim PODSite { get; set; }
        public virtual SitesDim POUSite { get; set; }
    }
}