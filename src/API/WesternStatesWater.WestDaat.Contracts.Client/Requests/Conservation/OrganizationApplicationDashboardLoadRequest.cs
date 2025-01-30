namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class OrganizationApplicationDashboardLoadRequest : ApplicationLoadRequestBase
{
    public Guid? OrganizationIdFilter { get; set; }
}