namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class AggregationStatistic : ControlledVocabularyBase
    {
        public AggregationStatistic()
        {
            VariablesDim = new HashSet<VariablesDim>();
        }
        
        public virtual ICollection<VariablesDim> VariablesDim { get; set; }
    }
}
