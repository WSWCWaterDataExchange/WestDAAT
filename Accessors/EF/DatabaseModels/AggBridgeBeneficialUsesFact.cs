using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class AggBridgeBeneficialUsesFact
    {
        public long AggBridgeId { get; set; }
        public string BeneficialUseCv { get; set; }
        public long AggregatedAmountId { get; set; }

        public virtual AggregatedAmountsFact AggregatedAmount { get; set; }
        public virtual BeneficialUse BeneficialUseCvNavigation { get; set; }
    }
}
