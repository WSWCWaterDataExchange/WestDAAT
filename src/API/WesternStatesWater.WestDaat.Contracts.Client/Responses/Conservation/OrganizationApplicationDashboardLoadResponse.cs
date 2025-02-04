namespace WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

public class OrganizationApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    required public ApplicationDashboardLIstItem[] Applications { get; set; }
}