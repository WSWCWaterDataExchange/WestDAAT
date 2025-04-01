namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class PolygonEtDatapoint
{
    public int Year { get; set; }

    public double TotalEtInInches { get; set; }

    public double? EffectivePrecipitationInInches { get; set; } = null!;

    public double? NetEtInInches { get; set; } = null!;
}
