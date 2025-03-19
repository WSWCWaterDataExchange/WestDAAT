namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationSupportingDocumentExistsResponse : ApplicationLoadResponseBase
{
    public bool DocumentExists { get; set; }
    
    public Guid? ApplicantId { get; set; }
    
    public Guid? FundingOrganizationId { get; set; }
}