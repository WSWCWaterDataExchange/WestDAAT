namespace WesternStatesWater.WestDaat.Contracts.Client;

public class SiteUsage
{
    public string AmountUnit { get; set; }
    public ICollection<SiteUsagePoint> SiteUsagePoints { get; set; }
}