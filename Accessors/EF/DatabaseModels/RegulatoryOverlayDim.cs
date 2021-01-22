using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class RegulatoryOverlayDim
    {
        public RegulatoryOverlayDim()
        {
            RegulatoryReportingUnitsFacts = new HashSet<RegulatoryReportingUnitsFact>();
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
        public string RegulatoryOverlayTypeCv { get; set; }
        public string WaterSourceTypeCv { get; set; }

        public virtual RegulatoryOverlayType RegulatoryOverlayTypeCvNavigation { get; set; }
        public virtual WaterSourceType WaterSourceTypeCvNavigation { get; set; }
        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFacts { get; set; }
    }
}
