namespace WesternStatesWater.WestDaat.Common.DataContracts
{
    public class Organization
    {
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
    }
}