using NetTopologySuite.Geometries;
using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class WaterSourcesDim
    {
        public WaterSourcesDim()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
            WaterSourceBridgeSitesFact = new HashSet<WaterSourceBridgeSitesFact>();
        }

        public long WaterSourceId { get; set; }
        public string WaterSourceUuid { get; set; }
        public string WaterSourceNativeId { get; set; }
        public string WaterSourceName { get; set; }
        public string WaterSourceTypeCv { get; set; }
        public string WaterQualityIndicatorCv { get; set; }
        public string GnisfeatureNameCv { get; set; }
        public Geometry Geometry { get; set; }

        public virtual GnisfeatureName GnisfeatureNameCvNavigation { get; set; }
        public virtual WaterQualityIndicator WaterQualityIndicatorCvNavigation { get; set; }
        public virtual WaterSourceType WaterSourceTypeCvNavigation { get; set; }
        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
        public virtual ICollection<WaterSourceBridgeSitesFact> WaterSourceBridgeSitesFact { get; set; }
    }
}
