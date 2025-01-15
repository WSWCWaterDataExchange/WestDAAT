namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class CoordinateMethod : ControlledVocabularyBase
    {
        public CoordinateMethod()
        {
            SitesDim = new HashSet<SitesDim>();
        }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
