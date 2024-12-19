namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class State : ControlledVocabularyBase
    {
        public State()
        {
            ReportingUnitsDim = new HashSet<ReportingUnitsDim>();
            SitesDims = new HashSet<SitesDim>();
        }
        
        public virtual ICollection<ReportingUnitsDim> ReportingUnitsDim { get; set; }
        public virtual ICollection<SitesDim> SitesDims { get; set; }
    }
}
