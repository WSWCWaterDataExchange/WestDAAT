namespace WesternStatesWater.WestDaat.Contracts.Client;

public class PolygonEtDataCollection
{
    public string PolygonWkt { get; set; }

    public double AverageYearlyEtInInches { get; set; }

    public double AverageYearlyEtInAcreFeet { get; set; }

    public PolygonEtDatapoint[] Datapoints { get; set; }
}
