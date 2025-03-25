namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : INotificationFormattingEngine
{
    public DTO.NotificationBase[] Format<T>(T[] notificationMetas)
    {
        return notificationMetas switch
        {
            DTO.WaterConservationApplicationSubmittedNotificationMeta[] metas => WaterConservationApplicationSubmittedNotifications(metas),
            _ => throw new NotImplementedException(
                $"Formatting notifications for type {typeof(T).Name} has not been implemented.")
        };
    }

    private DTO.NotificationBase[] WaterConservationApplicationSubmittedNotifications(DTO.WaterConservationApplicationSubmittedNotificationMeta[] metas)
    {
        var notifications = metas.Select(
            meta => meta.Type switch
            {
                DTO.NotificationType.Email => FormatWaterConservationApplicationSubmittedEmailNotification(meta),
                _ => throw new NotImplementedException("Formatting notifications of type " +
                                                       $"'{meta.Type}' has not been implemented.")
            }).ToArray();

        return notifications;
    }

    private DTO.NotificationBase FormatWaterConservationApplicationSubmittedEmailNotification(
        DTO.WaterConservationApplicationSubmittedNotificationMeta meta)
    {
        var applicationUrl = $"{_environmentConfiguration.SiteUrl}/application/{meta.ApplicationId}/submit";

        return new DTO.EmailNotification
        {
            EmailRequest = new DTO.EmailRequest
            {
                To = [meta.ToUser.EmailAddress],
                From = _emailServiceConfiguration.NotificationFrom,
                FromName = _emailServiceConfiguration.NotificationFromName,
                Subject = "Water Conservation Application Submitted",
                TextContent = "Your water conservation application has been submitted.",
                Body = "Your water conservation application has been submitted. "
                       + "You will receive an update once it has been reviewed. "
                       + $"Click <a href=\"{applicationUrl}\">here</a> to view your application."
            }
        };
    }
}