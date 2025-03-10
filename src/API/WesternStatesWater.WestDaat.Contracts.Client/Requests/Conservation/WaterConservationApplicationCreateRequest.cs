namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;

public class WaterConservationApplicationCreateRequest : ApplicationStoreRequestBase
{
    public Guid FundingOrganizationId { get; init; }

    public string WaterRightNativeId { get; set; } = null!;
}
