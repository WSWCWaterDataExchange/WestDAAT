namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class CropType : ControlledVocabularyBase
    {
        public CropType()
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