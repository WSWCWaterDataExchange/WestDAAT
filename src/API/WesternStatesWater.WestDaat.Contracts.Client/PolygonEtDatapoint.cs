namespace WesternStatesWater.WestDaat.Contracts.Client;

public class PolygonEtDatapoint
{
    public int Year { get; set; }

    public double TotalEtInInches { get; set; }

    public double? EffectivePrecipitationInInches { get; set; } = null!;

    public double? NetEtInInches { get; set; } = null!;
}
