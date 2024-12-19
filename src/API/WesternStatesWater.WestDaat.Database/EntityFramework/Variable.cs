namespace WesternStatesWater.WestDaat.Database.EntityFramework
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
