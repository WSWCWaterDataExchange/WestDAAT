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
    public const string ConservationApplicationStatusChanged = "conservation-application-status-changed";
}

/// <summary>
/// List of Azure Blob Storage containers used by the application.
/// Will need to match the following locations:
///   azuredeploy.json (bicep file)
///   docker-compose.dev.yml (azurite-init container).
/// </summary>
public static class Containers
{
    public const string ApplicationDocuments = "application-documents";
}