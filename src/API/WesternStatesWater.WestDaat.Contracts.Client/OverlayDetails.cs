
using GeoJSON.Text.Feature;

namespace WesternStatesWater.WestDaat.Contracts.Client;

public class OverlayDetails
{
    public string WaDEAreaReportingUuid { get; set; }
    public string ReportingAreaNativeID { get; set; }
    public List<string> WaDEOverlayAreaType { get; set; }
    public string NativeReportingAreaType { get; set; }
    public string State { get; set; }
    public DateTime? AreaLastUpdatedDate { get; set; }
    public string OrganizationName { get; set; }
    public string OrganizationState { get; set; }
    public string OrganizationWebsite { get; set; }
    public Feature Geometry { get; set; }
}