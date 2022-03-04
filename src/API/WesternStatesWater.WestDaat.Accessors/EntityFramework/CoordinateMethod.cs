using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class CoordinateMethod
    {
        public CoordinateMethod()
        {
            SitesDim = new HashSet<SitesDim>();
        }

        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(2)]
        public string Term { get; set; }
        [MaxLength(10)]
        public string Definition { get; set; }
        [MaxLength(10)]
        public string State { get; set; }
        [MaxLength(100)]
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
