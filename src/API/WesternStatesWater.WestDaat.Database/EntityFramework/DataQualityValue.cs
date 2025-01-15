namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class DataQualityValue : ControlledVocabularyBase
    {
        public DataQualityValue()
        {
            MethodsDim = new HashSet<MethodsDim>();
        }

        public virtual ICollection<MethodsDim> MethodsDim { get; set; }
    }
}