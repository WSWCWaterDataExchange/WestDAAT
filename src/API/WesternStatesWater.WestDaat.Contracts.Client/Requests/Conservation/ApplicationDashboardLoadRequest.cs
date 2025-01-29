namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

/// <summary>
/// Request to load applications for the dashboard.
/// </summary>
public class ApplicationDashboardLoadRequest : ApplicationLoadRequestBase
{
    public Guid? OrganizationId { get; set; }
}