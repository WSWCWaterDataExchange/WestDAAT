using NetTopologySuite.Geometries;

namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class Overlay
{
    public string WaDEAreaReportingUuid { get; set; }
    public string ReportingAreaNativeID { get; set; }
    public List<string> WaDEOverlayAreaType { get; set; }
    public string NativeReportingAreaType { get; set; }
    public string ReportingAreaName { get; set; }
    public string State { get; set; }
    public DateTime? AreaLastUpdatedDate { get; set; }
    public string OrganizationName { get; set; }
    public string OrganizationState { get; set; }
    public string OrganizationWebsite { get; set; }
    public Geometry Geometry { get; set; }
}
