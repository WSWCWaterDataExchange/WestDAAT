namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class OverlayTableEntry
{
    public string WaDEOverlayUUID { get; set; }
    public string OverlayNativeID { get; set; }
    public string OverlayName { get; set; }
    public string OverlayType { get; set; }
    public string WaterSourceType { get; set; }
    public string OverlayStatus { get; set; } //this need to be nullable? 
    public string OverlayStatute { get; set; }
    public string StatuteLink { get; set; }
    public DateTime? StatutoryEffectiveDate { get; set; }
    public DateTime? StatutoryEndDate { get; set; }
    public string OverlayStatusDesc { get; set; }
}
