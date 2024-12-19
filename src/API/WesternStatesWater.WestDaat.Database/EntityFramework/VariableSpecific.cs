namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class VariableSpecific : ControlledVocabularyBase
    {
        public VariableSpecific()
        {
            VariablesDim = new HashSet<VariablesDim>();
        }

        public virtual ICollection<VariablesDim> VariablesDim { get; set; }
    }
}
