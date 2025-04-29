namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class MultiPolygonYearlyEtResponse : CalculateResponseBase
{
    public PolygonEtDataCollection[] DataCollections { get; set; }

    public PointEtDataCollection ControlLocationDataCollection { get; set; } = null!;
}
