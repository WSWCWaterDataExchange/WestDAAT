namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationSupportingDocumentExistsResponse : ApplicationLoadResponseBase
{
    public bool DocumentExists { get; set; }
    
    public Guid? ApplicantUserId { get; set; }
    
    public Guid? FundingOrganizationId { get; set; }
}