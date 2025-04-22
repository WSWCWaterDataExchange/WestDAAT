﻿namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class OverlayReportingUnitsFact
    {
        public long BridgeId { get; set; }
        public long OrganizationId { get; set; }
        public long OverlayId { get; set; }
        public long ReportingUnitId { get; set; }
        public long DataPublicationDateId { get; set; }

        public virtual DateDim DataPublicationDate { get; set; }
        public virtual OrganizationsDim Organization { get; set; }
        public virtual OverlayDim Overlay { get; set; }
        public virtual ReportingUnitsDim ReportingUnit { get; set; }
    }
}
