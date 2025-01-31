namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDashboardLoadDetails[] Applications { get; set; }
}

public class ApplicationDashboardLoadDetails
{
    public Guid ApplicationId { get; set; }
    public string WaterRightNativeId { get; set; }
    public string ApplicationDisplayId { get; set; }

    public DateTimeOffset SubmittedDate {get; set; }
    public DateTimeOffset? AcceptedDate {get; set; }         
    public DateTimeOffset? RejectedDate {get; set; }         
    // public int CompensationRateDollars {get; set;}
    // public CompensationRateUnits CompensationRateUnits {get; set;}

    public string ApplicantFirstName {get; set;}
    public string ApplicantLastName {get; set;}

    public string OrganizationName { get; set; }
}