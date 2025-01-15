namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class ReportYearType : ControlledVocabularyBase
    {
        public ReportYearType()
        {
            VariablesDim = new HashSet<VariablesDim>();
        }

        public virtual ICollection<VariablesDim> VariablesDim { get; set; }
    }
}
