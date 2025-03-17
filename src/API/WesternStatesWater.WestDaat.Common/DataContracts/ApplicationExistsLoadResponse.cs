namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationExistsLoadResponse : ApplicationLoadResponseBase
{
    public bool ApplicationExists { get; set; }

    public Guid? ApplicationId { get; set; } = null!;

    public string ApplicationDisplayId { get; set; } = null!;

    public Guid? ApplicantUserId { get; set; } = null!;

    public Guid? FundingOrganizationId { get; set; } = null!;
}
