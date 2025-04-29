namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationRecommendedNotificationMeta : NotificationMetaBase
{
    required public Guid ApplicationId { get; init; }

    required public NotificationUser ToUser { get; init; }
}