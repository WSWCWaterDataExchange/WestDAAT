namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreRequest : ApplicationStoreRequestBase
{
    required public Guid WaterConservationApplicationId { get; set; }

    required public RasterTimeSeriesModel Model { get; set; }

    /// <summary>
    /// Inclusive.
    /// </summary>
    required public DateOnly DateRangeStart { get; set; }

    /// <summary>
    /// Inclusive.
    /// </summary>
    required public DateOnly DateRangeEnd { get; set; }

    required public int DesiredCompensationDollars { get; set; }

    required public CompensationRateUnits CompensationRateUnits { get; set; }

    required public int EstimatedCompensationDollars { get; set; }

    required public ApplicationEstimateStoreLocationDetails[] Locations { get; set; }
}
