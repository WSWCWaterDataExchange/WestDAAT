namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimateLocation
{
    public WaterConservationApplicationEstimateLocation()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateId { get; set; }

    public string PolygonWkt { get; set; } = null!;

    public double PolygonAreaInAcres { get; set; }

    public virtual WaterConservationApplicationEstimate Estimate { get; set; } = null!;

    public virtual ICollection<WaterConservationApplicationEstimateLocationConsumptiveUse> ConsumptiveUses { get; set; } = null!;
}
