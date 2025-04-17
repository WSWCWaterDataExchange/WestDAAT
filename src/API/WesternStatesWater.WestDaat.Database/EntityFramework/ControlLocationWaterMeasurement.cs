namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class ControlLocationWaterMeasurement
{
    public ControlLocationWaterMeasurement()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateControlLocationId { get; set; }

    public int Year { get; set; }

    public double TotalEtInInches { get; set; }

    public virtual WaterConservationApplicationEstimateControlLocation Location { get; set; } = null!;
}
