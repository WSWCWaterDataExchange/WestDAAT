namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class ApplicationDashboardLoadRequest : ApplicationLoadRequestBase
{
    public Guid? OrganizationIdFilter { get; set; }
}