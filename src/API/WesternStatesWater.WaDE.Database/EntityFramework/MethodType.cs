namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class MethodType : ControlledVocabularyBase
    {
        public MethodType()
        {
            MethodsDim = new HashSet<MethodsDim>();
        }

        public virtual ICollection<MethodsDim> MethodsDim { get; set; }
    }
}
