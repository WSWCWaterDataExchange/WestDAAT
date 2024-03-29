﻿namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class WaterSourceType
    {
        public WaterSourceType()
        {
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        public string Name { get; set; }
        public string WaDEName { get; set; }
        public string Term { get; set; }
        public string Definition { get; set; }
        public string State { get; set; }
        public string SourceVocabularyUri { get; set; }

        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }

        public virtual ICollection<RegulatoryOverlayDim> RegulatoryOverlayDim { get; set; }
    }
}
