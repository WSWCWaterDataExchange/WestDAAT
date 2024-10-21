namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
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
