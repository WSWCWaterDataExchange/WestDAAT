namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ControlLocationDetails
{
    public Guid Id { get; set; }

    public string PointWkt { get; set; } = null!;

    public ControlLocationWaterMeasurementDetails[] WaterMeasurements { get; set; } = null!;
}
