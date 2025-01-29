namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimatePolygon
{
    public WaterConservationApplicationEstimatePolygon()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateId { get; set; }

    public string PolygonWkt { get; set; } = null!;

    public virtual WaterConservationApplicationEstimate WaterConservationApplicationEstimate { get; set; } = null!;
}
