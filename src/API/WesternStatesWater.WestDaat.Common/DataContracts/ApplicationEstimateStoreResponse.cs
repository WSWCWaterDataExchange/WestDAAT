namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreResponse : ApplicationStoreResponseBase
{
    public Guid WaterConservationApplicationEstimateId { get; set; }

    public ApplicationEstimateLocationDetails[] Details { get; set; }
}
