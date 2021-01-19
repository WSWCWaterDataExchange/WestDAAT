using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class WaterSourcesDim
    {
        public WaterSourcesDim()
        {
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFacts = new HashSet<AllocationAmountsFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public long WaterSourceId { get; set; }
        public string WaterSourceUuid { get; set; }
        public string WaterSourceNativeId { get; set; }
        public string WaterSourceName { get; set; }
        public string WaterSourceTypeCv { get; set; }
        public string WaterQualityIndicatorCv { get; set; }
        public string GnisfeatureNameCv { get; set; }

        public virtual GnisfeatureName GnisfeatureNameCvNavigation { get; set; }
        public virtual WaterQualityIndicator WaterQualityIndicatorCvNavigation { get; set; }
        public virtual WaterSourceType WaterSourceTypeCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
