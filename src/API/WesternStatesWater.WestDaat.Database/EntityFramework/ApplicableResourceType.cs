namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class ApplicableResourceType : ControlledVocabularyBase
    {
        public ApplicableResourceType()
        {
            MethodsDim = new HashSet<MethodsDim>();
        }

        public virtual ICollection<MethodsDim> MethodsDim { get; set; }
    }
}
