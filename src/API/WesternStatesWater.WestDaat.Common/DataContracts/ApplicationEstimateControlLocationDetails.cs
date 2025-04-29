namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateControlLocationDetails
{
    public Guid WaterConservationApplicationEstimateControlLocationId { get; set; }

    public string PointWkt { get; set; } = null!;
}
