using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class RegulatoryReportingUnitsFact
    {
        public long BridgeId { get; set; }
        public long OrganizationId { get; set; }
        public long RegulatoryOverlayId { get; set; }
        public long ReportingUnitId { get; set; }
        public long DataPublicationDateId { get; set; }

        public virtual DateDim DataPublicationDate { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual RegulatoryOverlayDim RegulatoryOverlay { get; set; }
        public virtual ReportingUnitsDim ReportingUnit { get; set; }
    }
}
