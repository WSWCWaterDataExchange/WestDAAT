namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class AllocationBridgeSitesFact
    {
        public long AllocationBridgeId { get; set; }
        public long SiteId { get; set; }
        public long AllocationAmountId { get; set; }

        public virtual AllocationAmountsFact AllocationAmount { get; set; }
        public virtual SitesDim Site { get; set; }
    }
}