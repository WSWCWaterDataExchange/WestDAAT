namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class PolygonEtDataCollection
{
    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public string PolygonWkt { get; set; }

    public DrawToolType DrawToolType { get; set; }

    public double AverageYearlyEtInInches { get; set; }

    public double AverageYearlyEtInAcreFeet { get; set; }

    public PolygonEtDatapoint[] Datapoints { get; set; }
}
