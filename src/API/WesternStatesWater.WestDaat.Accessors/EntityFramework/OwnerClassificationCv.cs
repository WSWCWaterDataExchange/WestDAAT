namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class OwnerClassificationCv : ControlledVocabularyBase
    {
        public OwnerClassificationCv()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }

        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}
