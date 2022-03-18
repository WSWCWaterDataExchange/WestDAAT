namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class OwnerClassificationCv
    {
        public OwnerClassificationCv()
        {
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
        }

        public string Name { get; set; }
        public string WaDEName { get; set; }
        public string Term { get; set; }
        public string State { get; set; }
        public string Definition { get; set; }
        public string SourceVocabularyURI { get; set; }
        public string WaDEName { get; set; }

        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
    }
}
