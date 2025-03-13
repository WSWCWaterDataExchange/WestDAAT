namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class SubmittedApplicationExistsLoadResponse : ApplicationLoadResponseBase
{
    public bool ApplicationExists { get; set; }

    // these will only be populated if the application exists
    public Guid? ApplicantUserId { get; set; } = null!;

    public Guid? FundingOrganizationId { get; set; } = null!;
}
