namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationCreateRequest : ApplicationStoreRequestBase
{
    public string WaterRightNativeId { get; set; } = null!;
}
