using System;
using System.Collections.Generic;



namespace MapboxPrototypeAPI.Accessors.EF.DatabaseModels
{
    public partial class OrganizationsDim
    {
        public OrganizationsDim()
        {
            AggregatedAmountsFacts = new HashSet<AggregatedAmountsFact>();
            AllocationAmountsFacts = new HashSet<AllocationAmountsFact>();
            RegulatoryReportingUnitsFacts = new HashSet<RegulatoryReportingUnitsFact>();
            SiteVariableAmountsFacts = new HashSet<SiteVariableAmountsFact>();
        }

        public long OrganizationId { get; set; }
        public string OrganizationUuid { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationPurview { get; set; }
        public string OrganizationWebsite { get; set; }
        public string OrganizationPhoneNumber { get; set; }
        public string OrganizationContactName { get; set; }
        public string OrganizationContactEmail { get; set; }
        public string OrganizationDataMappingUrl { get; set; }
        public string State { get; set; }

        public virtual ICollection<AggregatedAmountsFact> AggregatedAmountsFacts { get; set; }
        public virtual ICollection<AllocationAmountsFact> AllocationAmountsFacts { get; set; }
        public virtual ICollection<RegulatoryReportingUnitsFact> RegulatoryReportingUnitsFacts { get; set; }
        public virtual ICollection<SiteVariableAmountsFact> SiteVariableAmountsFacts { get; set; }
    }
}
