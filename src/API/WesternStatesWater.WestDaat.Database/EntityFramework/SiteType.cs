namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class SiteType : ControlledVocabularyBase
    {
        public SiteType()
        {
            SitesDim = new HashSet<SitesDim>();
        }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
