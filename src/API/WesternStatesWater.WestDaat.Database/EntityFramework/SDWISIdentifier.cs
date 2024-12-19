namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class SDWISIdentifier : ControlledVocabularyBase
    {
        public SDWISIdentifier()
        {
           AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
           SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
           AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();

        }

        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
    }
}
