namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class LegalStatus : ControlledVocabularyBase
    {
        public LegalStatus()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }
        
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}
