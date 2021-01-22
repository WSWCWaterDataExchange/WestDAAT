using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
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
