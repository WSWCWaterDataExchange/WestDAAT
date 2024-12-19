namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class GnisfeatureName : ControlledVocabularyBase
    {
        public GnisfeatureName()
        {
            SitesDim = new HashSet<SitesDim>();
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }
    }
}