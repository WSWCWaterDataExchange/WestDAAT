namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
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
