namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class SitesBridgeBeneficialUsesFact
    {
        public long SiteBridgeId { get; set; }
        public string BeneficialUseCV { get; set; }
        public long SiteVariableAmountId { get; set; }

        public virtual BeneficialUsesCV BeneficialUse { get; set; }
        public virtual SiteVariableAmountsFact SiteVariableAmount { get; set; }
    }
}
