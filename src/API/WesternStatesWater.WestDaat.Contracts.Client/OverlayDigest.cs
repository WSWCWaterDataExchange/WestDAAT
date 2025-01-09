namespace WesternStatesWater.WestDaat.Contracts.Client;

public class OverlayDigest
{
    public string WaDeAreaReportingUuid { get; set; }
    public string ReportingAreaNativeId { get; set; }
    public string ReportingAreaName { get; set; }
    public List<string> WaDeOverlayAreaType { get; set; }
    public string NativeOverlayAreaType { get; set; }
}