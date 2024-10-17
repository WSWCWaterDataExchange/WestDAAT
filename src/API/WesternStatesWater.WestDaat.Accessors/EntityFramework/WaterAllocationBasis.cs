namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class WaterAllocationBasis : ControlledVocabularyBase
    {
        public WaterAllocationBasis()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }

        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}
