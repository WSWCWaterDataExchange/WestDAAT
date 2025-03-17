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

    [JsonIgnore]
    // There are two use cases involving this contract:
    // - Applicants should not be able to see the notes at all.
    // - for Reviewers, these notes are transferred directly onto the response contract.
    // Because neither use case needs these notes, we can - and should - ignore including them in the serialization.
    public ApplicationReviewNote[] Notes { get; set; } = null!;
}
