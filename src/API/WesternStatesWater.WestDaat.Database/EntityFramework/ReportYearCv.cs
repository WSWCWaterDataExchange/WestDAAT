namespace WesternStatesWater.WestDaat.Database.EntityFramework
{
    public partial class ReportYearCv : ControlledVocabularyBase
    {
        public ReportYearCv()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
        }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
    }
}
