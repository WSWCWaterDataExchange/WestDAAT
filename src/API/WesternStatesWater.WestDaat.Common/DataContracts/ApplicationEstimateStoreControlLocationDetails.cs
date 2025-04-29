namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreControlLocationDetails
{
    required public string PointWkt { get; set; }

    required public ApplicationEstimateStoreControlLocationWaterMeasurementsDetails[] WaterMeasurements { get; set; }
}
