using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class GnisfeatureName
    {
        public GnisfeatureName()
        {
            SitesDim = new HashSet<SitesDim>();
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)] 
        public string Term { get; set; }
        [MaxLength(4000)] 
        public string Definition { get; set; }
        [MaxLength(250)]
        public string State { get; set; }
        [MaxLength(250)]
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }
    }
}
