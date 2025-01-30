namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreRequest : ApplicationStoreRequestBase
{
    public Guid WaterConservationApplicationId { get; set; }

    public RasterTimeSeriesModel Model { get; set; }

    /// <summary>
    /// Inclusive.
    /// </summary>
    public DateOnly DateRangeStart { get; set; }

    /// <summary>
    /// Inclusive.
    /// </summary>
    public DateOnly DateRangeEnd { get; set; }

    public int? DesiredCompensationDollars { get; set; }

    public CompensationRateUnits? Units { get; set; }

    public int? EstimatedCompensation { get; set; }

    public ApplicationEstimateStoreLocationDetails[] Locations { get; set; }
}
