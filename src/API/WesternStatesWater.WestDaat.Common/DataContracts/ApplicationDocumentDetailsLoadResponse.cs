namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDocumentDownloadResponse : ApplicationLoadResponseBase
{
    public Guid ApplicantId { get; set; }
    
    public Guid FundingOrganizationId { get; set; }
    
    public Guid WaterConservationApplicationDocumentId { get; set; }
    
    public string WaterConservationApplicationDocumentBlobName { get; set; }
    
    public string WaterConservationApplicationDocumentFileName { get; set; }
}