namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDetails
{
    public Guid Id { get; set; }

    public Guid ApplicantUserId { get; set; }

    public Guid FundingOrganizationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public string ApplicationDisplayId { get; set; } = null!;

    public EstimateDetails Estimate { get; set; } = null!;

    public SubmissionDetails Submission { get; set; } = null!;

    public SupportingDocumentDetails[] SupportingDocuments { get; set; } = null!;
}
