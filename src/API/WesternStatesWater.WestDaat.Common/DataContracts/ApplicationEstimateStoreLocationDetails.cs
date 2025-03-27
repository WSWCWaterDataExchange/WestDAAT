namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreLocationDetails
{
    required public string PolygonWkt { get; set; }

    required public DrawToolType PolygonType { get; set; }

    required public double PolygonAreaInAcres { get; set; }

    required public ApplicationEstimateStoreLocationConsumptiveUseDetails[] ConsumptiveUses { get; set; }
}
