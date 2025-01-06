namespace WesternStatesWater.WestDaat.Common.Constants;

/// <summary>
///  List of Azure Service Bus queues used by the application.
///  Will need to match the following locations:
///    azuredeploy.json (bicep file)
///    sb-emulator.config.json (service bus emulator config). 
/// </summary>
public static class Queues
{
    public const string SmokeTest = "smoke-test"; // Local only
    public const string ConservationApplicationSubmitted = "conservation-application-submitted";
}