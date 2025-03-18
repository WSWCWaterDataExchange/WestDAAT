namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationSupportingDocumentExistsResponse : ApplicationLoadResponseBase
{
    public Guid ApplicantId { get; set; }
    
    public Guid FundingOrganizationId { get; set; }
}