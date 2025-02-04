namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationDashboardLoadResponse : ApplicationLoadResponseBase
{
    public ApplicationListItemDetails[] Applications { get; set; }
}