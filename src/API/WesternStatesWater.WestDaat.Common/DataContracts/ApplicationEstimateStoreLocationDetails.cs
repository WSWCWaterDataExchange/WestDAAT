namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreLocationDetails
{
    public Guid WaterConservationApplicationEstimateId { get; set; }

    public string PolygonWkt { get; set; }

    public double PolygonAreaInAcres { get; set; }

    public ApplicationEstimateStoreLocationConsumptiveUseDetails[] ConsumptiveUses { get; set; }
}
