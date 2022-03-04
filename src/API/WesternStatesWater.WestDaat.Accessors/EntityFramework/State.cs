using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class State
    {
        public State()
        {
            ReportingUnitsDim = new HashSet<ReportingUnitsDim>();
            SitesDims = new HashSet<SitesDim>();
        }

        [MaxLength(2)]
        public string Name { get; set; }
        [MaxLength(2)]
        public string Term { get; set; }
        [MaxLength(20)]
        public string Definition { get; set; }
        [MaxLength(10)]
        public string State1 { get; set; }
        [MaxLength(100)]
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<ReportingUnitsDim> ReportingUnitsDim { get; set; }
        public virtual ICollection<SitesDim> SitesDims { get; set; }
    }
}
