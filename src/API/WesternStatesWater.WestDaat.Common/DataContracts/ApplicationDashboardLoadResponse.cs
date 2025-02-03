namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationDashboardLoadDetails[] Applications { get; set; }
}