namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta : NotificationMetaBase
{
    public Guid ApplicationId { get; init; }

    public NotificationUser ToUser { get; init; } = null!;
}