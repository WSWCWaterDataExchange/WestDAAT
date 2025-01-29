namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MultiPolygonYearlyEtResponse : CalculateResponseBase
{
    public PolygonEtDataCollection[] Data { get; set; }
}
