using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public class RegulatoryOverlayType
    {
        public RegulatoryOverlayType()
        {
            RegulatoryOverlayDim = new HashSet<RegulatoryOverlayDim>();
        }

        public string Name { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<RegulatoryOverlayDim> RegulatoryOverlayDim { get; set; }
    }
}
