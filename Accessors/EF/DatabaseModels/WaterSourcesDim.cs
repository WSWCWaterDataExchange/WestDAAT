using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class WaterSourcesDim
    {
        public WaterSourcesDim()
        {
            Sites = new HashSet<SitesDim>();
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
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
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
        public virtual ICollection<SitesDim> Sites { get; set; }
    }
}
