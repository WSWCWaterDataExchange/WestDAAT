namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class NhdnetworkStatus : ControlledVocabularyBase
    {
        public NhdnetworkStatus()
        {
            SitesDim = new HashSet<SitesDim>();
        }
        
        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
