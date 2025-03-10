namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    required public ApplicationDashboardListItem[] Applications { get; set; }
}