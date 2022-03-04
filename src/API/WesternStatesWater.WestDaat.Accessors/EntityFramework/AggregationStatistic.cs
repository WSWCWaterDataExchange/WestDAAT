namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class AggregationStatistic
    {
        public AggregationStatistic()
        {
            VariablesDim = new HashSet<VariablesDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<VariablesDim> VariablesDim { get; set; }
    }
}
