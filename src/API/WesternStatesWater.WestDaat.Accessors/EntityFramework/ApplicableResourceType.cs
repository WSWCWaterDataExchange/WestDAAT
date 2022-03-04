namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class ApplicableResourceType
    {
        public ApplicableResourceType()
        {
            MethodsDim = new HashSet<MethodsDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<MethodsDim> MethodsDim { get; set; }
    }
}
