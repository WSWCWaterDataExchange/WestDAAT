namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class AllocationBridgeBeneficialUsesFact
    {
        public long AllocationBridgeId { get; set; }
        public string BeneficialUseCV { get; set; }
        public long AllocationAmountId { get; set; }

        public virtual AllocationAmountsFact AllocationAmount { get; set; }
        public virtual BeneficialUsesCV BeneficialUse { get; set; }
    }
}
