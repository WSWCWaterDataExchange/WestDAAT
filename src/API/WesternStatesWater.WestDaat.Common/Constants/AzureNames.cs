namespace WesternStatesWater.WestDaat.Common.Constants;

/// <summary>
///  List of Azure Service Bus queues used by the application.
///  Will need to match the following locations:
///    azuredeploy.bicep
///    sb-emulator.config.json (service bus emulator config). 
/// </summary>
public static class Queues
{
    public const string SmokeTest = "smoke-test"; // Local only
    public const string ConservationApplicationSubmitted = "conservation-application-submitted";
    public const string ConservationApplicationRecommended = "conservation-application-recommended";
}

/// <summary>
/// List of Azure Blob Storage containers used by the application.
/// Will need to match the following locations:
///   azuredeploy.bicep
///   docker-compose.dev.yml (azurite-init container).
/// </summary>
public static class Containers
{
    public const string ApplicationDocuments = "application-documents";
}