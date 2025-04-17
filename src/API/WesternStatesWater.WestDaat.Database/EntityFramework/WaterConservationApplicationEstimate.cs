using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Database.EntityFramework;

public class WaterConservationApplicationEstimate
{
    public WaterConservationApplicationEstimate()
    {
    }

    public Guid Id { get; set; }

    public Guid WaterConservationApplicationId { get; set; }

    public RasterTimeSeriesModel Model { get; set; }

    public DateOnly DateRangeStart { get; set; }

    public DateOnly DateRangeEnd { get; set; }

    public int CompensationRateDollars { get; set; }

    public CompensationRateUnits CompensationRateUnits { get; set; }

    public int EstimatedCompensationDollars { get; set; }

    public double CumulativeTotalEtInAcreFeet { get; set; }

    public double? CumulativeNetEtInAcreFeet { get; set; }

    public virtual WaterConservationApplication WaterConservationApplication { get; set; } = null!;

    public virtual ICollection<WaterConservationApplicationEstimateLocation> Locations { get; set; } = null!;

    public virtual ICollection<WaterConservationApplicationEstimateControlLocation> ControlLocations { get; set; } = null!;
}