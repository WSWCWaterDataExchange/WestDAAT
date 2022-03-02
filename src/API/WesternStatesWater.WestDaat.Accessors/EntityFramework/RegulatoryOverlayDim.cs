using System;
using System.Collections.Generic;

namespace WesternStatesWater.WestDaat.Accessors.EntityFramework
{
    public partial class RegulatoryOverlayDim
    {
        public RegulatoryOverlayDim()
        {
            RegulatoryReportingUnitsFact = new HashSet<RegulatoryReportingUnitsFact>();
        }

        public long RegulatoryOverlayId { get; set; }
        public string RegulatoryOverlayUuid { get; set; }
        public string RegulatoryOverlayNativeId { get; set; }
        public string RegulatoryName { get; set; }
        public string RegulatoryDescription { get; set; }
        public string RegulatoryStatusCv { get; set; }
        public string OversightAgency { get; set; }
        public string RegulatoryStatute { get; set; }
        public string RegulatoryStatuteLink { get; set; }
        public DateTime StatutoryEffectiveDate { get; set; }
        public DateTime? StatutoryEndDate { get; set; }
        public string RegulatoryOverlayTypeCV { get; set; }
        public string WaterSourceTypeCV { get; set; }

        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFact { get; set; }

        public virtual WaterSourceType WaterSourceType { get; set; }

        public virtual RegulatoryOverlayType RegulatoryOverlayType { get; set; }
        public virtual ICollection<RegulatoryOverlayBridgeSitesFact> RegulatoryOverlayBridgeSitesFact { get; set; }
    }
}
