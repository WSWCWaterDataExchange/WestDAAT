namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
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
