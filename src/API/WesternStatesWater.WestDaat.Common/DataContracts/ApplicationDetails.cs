using System.Text.Json.Serialization;

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

    public ConservationApplicationStatus Status { get; set; }

    // JsonIgnore so the json is never sent to the client.
    // This is mapped to two separate client contracts.
    [JsonIgnore] public ApplicationReviewNote[] Notes { get; set; } = null!;

    // JsonIgnore so the json is never sent to the client.
    // This is mapped to two separate client contracts.
    [JsonIgnore] public ReviewPipeline ReviewPipeline { get; set; } = null!;
}