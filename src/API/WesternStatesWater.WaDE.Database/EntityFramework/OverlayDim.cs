namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class OverlayDim
    {
        public OverlayDim()
        {
            OverlayReportingUnitsFact = new HashSet<OverlayReportingUnitsFact>();
        }

        public long OverlayId { get; set; }
        public string OverlayUuid { get; set; }
        public string OverlayNativeId { get; set; }
        public string OverlayName { get; set; }
        public string OverlayDescription { get; set; }
        public string OverlayStatusCv { get; set; }
        public string OversightAgency { get; set; }
        public string Statute { get; set; }
        public string StatuteLink { get; set; }
        public DateTime StatutoryEffectiveDate { get; set; }
        public DateTime? StatutoryEndDate { get; set; }
        public string OverlayTypeCV { get; set; }
        public string WaterSourceTypeCV { get; set; }

        public virtual ICollection<OverlayReportingUnitsFact> OverlayReportingUnitsFact { get; set; }

        public virtual WaterSourceType WaterSourceType { get; set; }

        public virtual OverlayTypeCv OverlayType { get; set; }
        public virtual ICollection<OverlayBridgeSitesFact> OverlayBridgeSitesFact { get; set; }
    }
}
