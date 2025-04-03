namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateStoreResponse : ApplicationStoreResponseBase
{
    public ApplicationEstimateLocationDetails[] Details { get; set; }

    public ApplicationEstimateControlLocationDetails ControlLocationDetails { get; set; }
}
