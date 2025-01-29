namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimateLocationConsumptiveUse
{
    public WaterConservationApplicationEstimateLocationConsumptiveUse()
    {

    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public int Year { get; set; }

    public double EtInInches { get; set; }
}
