﻿namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class ReportingUnitType : ControlledVocabularyBase
    {
        public ReportingUnitType()
        {
            ReportingUnitsDim = new HashSet<ReportingUnitsDim>();
        }
        
        public virtual ICollection<ReportingUnitsDim> ReportingUnitsDim { get; set; }
    }
}
