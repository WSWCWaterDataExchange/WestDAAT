using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class AllocationBridgeBeneficialUsesFact
    {
        public long AllocationBridgeId { get; set; }
        public string BeneficialUseCv { get; set; }
        public long AllocationAmountId { get; set; }

        public virtual AllocationAmountsFact AllocationAmount { get; set; }
        public virtual BeneficialUse BeneficialUseCvNavigation { get; set; }
    }
}
