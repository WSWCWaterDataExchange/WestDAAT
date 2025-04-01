namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationSubmittedApplicantNotificationMeta : NotificationMetaBase
{
    public Guid ApplicationId { get; init; }

    public NotificationUser ToUser { get; init; } = null!;
}