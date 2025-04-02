namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationSubmittedAdminNotificationMeta : NotificationMetaBase
{
    required public Guid ApplicationId { get; init; }

    required public NotificationUser ToUser { get; init; }

    required public string FundingOrganizationName { get; set; }
}