namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class WaterSourceBridgeSitesFact
    {
        public long WaterSourceBridgeSiteId { get; set; }
        public long SiteId { get; set; }
        public long WaterSourceId { get; set; }

        public virtual WaterSourcesDim WaterSource { get; set; }
        public virtual SitesDim Site { get; set; }
    }
}