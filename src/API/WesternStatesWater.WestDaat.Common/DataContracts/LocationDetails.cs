namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class LocationDetails
{
    public Guid Id { get; set; }

    public string PolygonWkt { get; set; } = null!;

    public DrawToolType DrawToolType { get; set; }

    public double PolygonAreaInAcres { get; set; }

    public string AdditionalDetails { get; set; } = null!;

    public ConsumptiveUseDetails[] WaterMeasurements { get; set; } = null!;
}
