namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationExistsLoadResponse : ApplicationLoadResponseBase
{
    public bool ApplicationExists { get; set; }

    public Guid? ApplicationId { get; set; }

    public string ApplicationDisplayId { get; set; } = null!;

    public Guid? ApplicantUserId { get; set; }

    public Guid? FundingOrganizationId { get; set; }

    public string FundingOrganizationName { get; set; } = null!;

    public ConservationApplicationStatus? Status { get; set; }
}