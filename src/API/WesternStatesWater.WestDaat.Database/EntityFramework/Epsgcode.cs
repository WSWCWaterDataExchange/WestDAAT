namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class Epsgcode : ControlledVocabularyBase
    {
        public Epsgcode()
        {
            ReportingUnitsDim = new HashSet<ReportingUnitsDim>();
            SitesDim = new HashSet<SitesDim>();
        }

        public virtual ICollection<ReportingUnitsDim> ReportingUnitsDim { get; set; }
        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}