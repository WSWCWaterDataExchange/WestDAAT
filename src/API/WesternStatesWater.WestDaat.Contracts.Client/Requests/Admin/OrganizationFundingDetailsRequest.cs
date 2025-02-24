namespace WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

public class OrganizationFundingDetailsRequest : OrganizationLoadRequestBase
{
    public string WaterRightNativeId { get; set; } = null!;
}
