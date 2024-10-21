namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class CustomerType : ControlledVocabularyBase
    {
        public CustomerType()
        {
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
        }

        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
    }
}