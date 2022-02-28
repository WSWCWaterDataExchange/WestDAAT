using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class SiteType
    {
        public SiteType()
        {
            SitesDim = new HashSet<SitesDim>();
        }

        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Term { get; set; }
        public string Definition { get; set; }
        [MaxLength(250)]
        public string State { get; set; }
        [MaxLength(250)]
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<SitesDim> SitesDim { get; set; }
    }
}
