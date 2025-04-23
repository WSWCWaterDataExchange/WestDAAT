namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class OverlayBridgeSitesFact
    {
        public long OverlayBridgeId { get; set; }
        public long OverlayId { get; set; }
        public long SiteId { get; set; }
        
        public virtual OverlayDim Overlay { get; set; }
        public virtual SitesDim Site { get; set; }
    }
}