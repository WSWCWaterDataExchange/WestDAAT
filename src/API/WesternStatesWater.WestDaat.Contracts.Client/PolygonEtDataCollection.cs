namespace WesternStatesWater.WestDaat.Contracts.Client;

public class PolygonEtDataCollection
{
    public string PolygonWkt { get; set; }

    public double AverageEtInInches { get; set; }

    public PolygonEtDatapoint[] Datapoints { get; set; }
}
