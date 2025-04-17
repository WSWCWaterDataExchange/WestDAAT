namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimateControlLocation
{
    public WaterConservationApplicationEstimateControlLocation()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateId { get; set; }

    public string PointWkt { get; set; } = null!;

    public virtual WaterConservationApplicationEstimate Estimate { get; set; } = null!;

    public virtual ICollection<ControlLocationWaterMeasurement> WaterMeasurements { get; set; } = null!;
}
