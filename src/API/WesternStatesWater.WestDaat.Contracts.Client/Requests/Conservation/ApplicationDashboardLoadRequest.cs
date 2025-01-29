namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

/// <summary>
/// Request to load applications for the dashboard based on the filter criteria.
/// </summary>
public class ApplicationDashboardLoadRequest : ApplicationLoadRequestBase
{
    public Guid? OrganizationId { get; set; }
    
    // TODO: Status (enum)
    // TODO: ReviewerType (needs definition)
    // TODO: SubmittedStartDate (needs definition)
    // TODO: SubmittedEndDate (needs definition)
    // TODO: Paging (needs definition)
}