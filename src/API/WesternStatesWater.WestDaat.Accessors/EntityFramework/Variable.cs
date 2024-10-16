namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class Variable : ControlledVocabularyBase
    {
        public Variable()
        {
            VariablesDim = new HashSet<VariablesDim>();
        }

        public virtual ICollection<VariablesDim> VariablesDim { get; set; }
    }
}
