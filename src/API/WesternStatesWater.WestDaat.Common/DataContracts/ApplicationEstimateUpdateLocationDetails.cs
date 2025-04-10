namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateUpdateLocationDetails
{
    required public Guid? WaterConservationApplicationEstimateLocationId { get; set; }

    required public string PolygonWkt { get; set; }

    required public DrawToolType DrawToolType { get; set; }

    required public double PolygonAreaInAcres { get; set; }

    required public ApplicationEstimateStoreLocationConsumptiveUseDetails[] ConsumptiveUses { get; set; }
}
