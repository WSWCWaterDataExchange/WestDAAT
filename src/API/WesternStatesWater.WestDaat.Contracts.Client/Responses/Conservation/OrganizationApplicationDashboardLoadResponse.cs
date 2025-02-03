namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    required public OrganizationApplicationDashboardListItem[] Applications { get; set; }

    required public OrganizationApplicationDashboardStatistics Statistics { get; set; }
}