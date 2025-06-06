﻿namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class WaterQualityIndicator : ControlledVocabularyBase
    {
        public WaterQualityIndicator()
        {
            WaterSourcesDim = new HashSet<WaterSourcesDim>();
        }

        public virtual ICollection<WaterSourcesDim> WaterSourcesDim { get; set; }
    }
}
