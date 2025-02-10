namespace WesternStatesWater.WestDaat.Common.Configuration;

public class OpenEtConfiguration
{
    public string BaseAddress { get; set; }

    public string ApiKey { get; set; }

    public int MaximumPermissibleRequestsPerMinute { get; set; }

    public int MaximumQueueableRequestsPerMinute { get; set; }
}