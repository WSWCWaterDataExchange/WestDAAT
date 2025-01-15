namespace WesternStatesWater.WaDE.Database.EntityFramework
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
