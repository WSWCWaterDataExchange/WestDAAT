namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class SiteUsageListItem
{
    public string WaDEVariableUuid { get; set; }
    public string WaDEMethodUuid { get; set; }
    public string WaDEWaterSourceUuid { get; set; }
    public DateTime TimeframeStart { get; set; }
    public DateTime TimeframeEnd { get; set; }
    public string ReportYear { get; set; }
    public double Amount { get; set; }
    public string PrimaryUse { get; set; }
    public long? PopulationServed { get; set; }
    public double? CropDutyAmount { get; set; }
    public string CommunityWaterSupplySystem { get; set; }
}