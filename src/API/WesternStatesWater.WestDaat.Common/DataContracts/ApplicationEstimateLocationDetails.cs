namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateLocationDetails
{
    public Guid WaterConservationApplicationEstimateLocationId { get; set; }

    public string PolygonWkt { get; set; } = null!;
}
