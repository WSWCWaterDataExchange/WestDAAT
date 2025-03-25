namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationSubmittedNotificationMeta : NotificationMetaBase
{
    public Guid ApplicationId { get; init; }

    public NotificationUser ToUser { get; init; } = null!;
}