namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class RegulatoryOverlayBridgeSitesFact
    {
        public long RegulatoryOverlayBridgeId { get; set; }
        public long RegulatoryOverlayId { get; set; }
        public long SiteId { get; set; }
        
        public virtual RegulatoryOverlayDim RegulatoryOverlay { get; set; }
        public virtual SitesDim Site { get; set; }
    }
}