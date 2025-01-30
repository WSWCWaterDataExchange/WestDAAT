namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreLocationConsumptiveUseDetails
{
    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public int Year { get; set; }

    public double EtInInches { get; set; }
}
