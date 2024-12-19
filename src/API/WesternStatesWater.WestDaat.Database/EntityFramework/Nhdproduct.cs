namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class Nhdproduct : ControlledVocabularyBase
    {
        public Nhdproduct()
        {
            SitesDim = new HashSet<SitesDim>();
        }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
