namespace WesternStatesWater.WaDE.Database.EntityFramework
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
