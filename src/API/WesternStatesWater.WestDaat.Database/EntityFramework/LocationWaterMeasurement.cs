namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class LocationWaterMeasurement
{
    public LocationWaterMeasurement()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public int Year { get; set; }

    public double TotalEtInInches { get; set; }

    public double? EffectivePrecipitationInInches { get; set; } = null!;

    public double? NetEtInInches { get; set; } = null!;

    public virtual WaterConservationApplicationEstimateLocation Location { get; set; } = null!;
}
