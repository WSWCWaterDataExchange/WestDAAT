namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardStatistics
{
    required public int SubmittedApplicationCount { get; set; }

    required public int ApprovedApplicationCount { get; set; }

    required public int RejectedApplicationCount { get; set; }

    required public int InReviewApplicationCount { get; set; }

    required public int CumulativeEstimatedSavingsAcreFt { get; set; }

    required public int TotalObligationDollars { get; set; }
}