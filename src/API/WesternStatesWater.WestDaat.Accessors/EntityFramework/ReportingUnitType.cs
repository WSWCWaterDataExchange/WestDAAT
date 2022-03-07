namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class ReportingUnitType
    {
        public ReportingUnitType()
        {
            ReportingUnitsDim = new HashSet<ReportingUnitsDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<ReportingUnitsDim> ReportingUnitsDim { get; set; }
    }
}
