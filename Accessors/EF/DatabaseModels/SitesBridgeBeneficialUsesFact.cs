using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class SitesBridgeBeneficialUsesFact
    {
        public long SiteBridgeId { get; set; }
        public string BeneficialUseCv { get; set; }
        public long SiteVariableAmountId { get; set; }

        public virtual BeneficialUse BeneficialUseCvNavigation { get; set; }
        public virtual SiteVariableAmountsFact SiteVariableAmount { get; set; }
    }
}
