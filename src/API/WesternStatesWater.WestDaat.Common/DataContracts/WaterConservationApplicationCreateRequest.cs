namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationCreateRequest : ApplicationStoreRequestBase
{
    public Guid FundingOrganizationId { get; set; }

    public Guid ApplicantUserId { get; set; }

    public string WaterRightNativeId { get; set; } = null!;

    public string ApplicationDisplayId { get; set; } = null!;
}