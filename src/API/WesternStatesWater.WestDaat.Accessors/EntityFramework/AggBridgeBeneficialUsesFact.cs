using System;
using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class AggBridgeBeneficialUsesFact
    {
        public long AggBridgeId { get; set; }
        public string BeneficialUseCV { get; set; }
        public long AggregatedAmountId { get; set; }

        public virtual AggregatedAmountsFact AggregatedAmount { get; set; }
        public virtual BeneficialUsesCV BeneficialUse { get; set; }
    }
}
