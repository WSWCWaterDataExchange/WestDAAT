namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class Units : ControlledVocabularyBase
    {
        public Units()
        {
            VariablesDimAggregationIntervalUnitCvNavigation = new HashSet<VariablesDim>();
            VariablesDimAmountUnitCvNavigation = new HashSet<VariablesDim>();
            VariablesDimMaximumAmountUnitCvNavigation = new HashSet<VariablesDim>();
        }

        public virtual ICollection<VariablesDim> VariablesDimAggregationIntervalUnitCvNavigation { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimAmountUnitCvNavigation { get; set; }
        public virtual ICollection<VariablesDim> VariablesDimMaximumAmountUnitCvNavigation { get; set; }
    }
}
