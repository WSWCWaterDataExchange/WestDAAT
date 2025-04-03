namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimateLocation
{
    public WaterConservationApplicationEstimateLocation()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateId { get; set; }

    public string PolygonWkt { get; set; } = null!;

    public Common.DataContracts.DrawToolType DrawToolType { get; set; }

    public double PolygonAreaInAcres { get; set; }

    public string AdditionalDetails { get; set; } = null!;

    public virtual WaterConservationApplicationEstimate Estimate { get; set; } = null!;

    public virtual ICollection<LocationWaterMeasurement> WaterMeasurements { get; set; } = null!;
}
