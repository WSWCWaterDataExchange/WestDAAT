namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    required public OrganizationApplicationDashboardListItem[] Applications { get; set; }
    required public OrganizationApplicationDashboardStatistics Statistics { get; set; }
}

public class OrganizationApplicationDashboardListItem
{
    required public Guid ApplicationId { get; set; }
    required public string ApplicationDisplayId { get; set; }
    required public string ApplicantFullName { get; set; }
    required public string OrganizationName { get; set; }
    required public string WaterRightNativeId { get; set; }
    required public DateTimeOffset SubmittedDate { get; set; }
    // required public string State { get; set; }
    required public ConservationApplicationStatus Status { get; set; }
}

public class OrganizationApplicationDashboardStatistics
{
    required public int SubmittedApplicationCount { get; set; }
    required public int ApprovedApplicationCount { get; set; }
    required public int RejectedApplicationCount { get; set; }
    required public int InReviewApplicationCount { get; set; }
    required public int CumulativeEstimatedSavingsAcreFt { get; set; }
    required public int TotalObligationDollars { get; set; }
}

public enum ConservationApplicationStatus
{
    InReview = 0,
    Approved = 1,
    Rejected = 2
}