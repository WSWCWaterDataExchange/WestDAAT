namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDetailsBase
{
    public Guid Id { get; set; }

    public Guid ApplicantId { get; set; }

    public Guid FundingOrganizationId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public string ApplicationDisplayId { get; set; } = null!;

    // this will be retrieved later
    public string StaticMapBlobUrl { get; set; } = null;

    public EstimateDetails Estimate { get; set; } = null!;

    public SubmissionDetails Submission { get; set; } = null!;
}
