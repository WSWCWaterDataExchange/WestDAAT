namespace WesternStatesWater.WestDaat.Common.DataContracts;

public class WaterConservationApplicationApprovedApplicantNotificationMeta : NotificationMetaBase
{
    required public Guid ApplicationId { get; init; }

    required public NotificationUser ToUser { get; init; }

    required public ConservationApplicationStatus ApplicationStatus { get; init; }

    required public string ApprovalNote { get; set; }
}