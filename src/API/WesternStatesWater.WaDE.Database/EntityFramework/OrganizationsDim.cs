namespace WesternStatesWater.WaDE.Database.EntityFramework
{
    public partial class OrganizationsDim
    {
        public OrganizationsDim()
        {
            AggregatedAmountsFact = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFact = new HashSet<AllocationAmountsFact>();
            OverlayReportingUnitsFact = new HashSet<OverlayReportingUnitsFact>();
            SiteVariableAmountsFact = new HashSet<SiteVariableAmountsFact>();
        }

        public long OrganizationId { get; set; }
        public string OrganizationUuid { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationPurview { get; set; }
        public string OrganizationWebsite { get; set; }
        public string OrganizationPhoneNumber { get; set; }
        public string OrganizationContactName { get; set; }
        public string OrganizationContactEmail { get; set; }
        public string State { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFact { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFact { get; set; }
        public virtual ICollection<OverlayReportingUnitsFact> OverlayReportingUnitsFact { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFact { get; set; }
    }
}
