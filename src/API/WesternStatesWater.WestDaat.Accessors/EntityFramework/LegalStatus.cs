namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class LegalStatus
    {
        public LegalStatus()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}
