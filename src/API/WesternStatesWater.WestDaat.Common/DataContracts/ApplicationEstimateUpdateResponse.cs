namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class ApplicationEstimateUpdateResponse : ApplicationStoreResponseBase
{
    public ApplicationEstimateLocationDetails[] Details { get; set; }

    public ApplicationEstimateControlLocationDetails ControlLocationDetails { get; set; }
}
