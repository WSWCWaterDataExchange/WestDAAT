using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : INotificationFormattingEngine
{
    public DTO.NotificationBase[] Format<T>(T[] notificationMetas)
    {
        // Group by type so we can mix-and-match different
        // notification types in the notification array
        var notifications = notificationMetas
            .GroupBy(meta => meta!.GetType())
            .SelectMany(group => group.First() switch
            {
                DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta => ApplicationSubmittedApplicantNotifications(
                    group.Cast<DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta>().ToArray()),
                DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta => ApplicationSubmittedFundingOrganizationNotifications(
                    group.Cast<DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta>().ToArray()),
                _ => throw new NotImplementedException(
                    $"Formatting notifications for type {group.Key.Name} has not been implemented."
                )
            })
            .ToArray();

        return notifications;
    }

    private DTO.NotificationBase[] ApplicationSubmittedApplicantNotifications(DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta[] metas)
    {
        var notifications = metas.Select(
            meta => meta.Type switch
            {
                DTO.NotificationType.Email => FormatApplicationSubmittedApplicantEmailNotification(meta),
                _ => throw new NotImplementedException("Formatting notifications of type " +
                                                       $"'{meta.Type}' has not been implemented.")
            }).ToArray();

        return notifications;
    }

    private DTO.NotificationBase FormatApplicationSubmittedApplicantEmailNotification(
        DTO.WaterConservationApplicationSubmittedApplicantNotificationMeta meta)
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

    private DTO.NotificationBase[] ApplicationSubmittedFundingOrganizationNotifications(
        DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta[] metas)
    {
        var notifications = metas.Select(
            meta => meta.Type switch
            {
                DTO.NotificationType.Email => FormatApplicationSubmittedFundingOrganizationEmailNotification(meta),
                _ => throw new NotImplementedException("Formatting notifications of type " +
                                                       $"'{meta.Type}' has not been implemented.")
            }).ToArray();

        return notifications;
    }

    private DTO.NotificationBase FormatApplicationSubmittedFundingOrganizationEmailNotification(
        DTO.WaterConservationApplicationSubmittedFundingOrganizationNotificationMeta meta)
    {
        var canReview = meta.ToUserPermissions.Contains(Permissions.ApplicationUpdate);
        var canApprove = meta.ToUserPermissions.Contains(Permissions.ApplicationApprove);

        var applicationUrl = (canReview, canApprove) switch
        {
            (true, _) => $"{_environmentConfiguration.SiteUrl}/application/{meta.ApplicationId}/review/form",
            (_, true) => $"{_environmentConfiguration.SiteUrl}/application/{meta.ApplicationId}/approve",
            _ => $"{_environmentConfiguration.SiteUrl}" // Homepage as backup url
        };

        return new DTO.EmailNotification
        {
            EmailRequest = new DTO.EmailRequest
            {
                To = [meta.ToUser.EmailAddress],
                From = _emailServiceConfiguration.NotificationFrom,
                FromName = _emailServiceConfiguration.NotificationFromName,
                Subject = "New Water Conservation Application Submitted",
                TextContent = "A water conservation application has been submitted.",
                Body = "A water conservation application has been submitted. "
                       + $"Click <a href=\"{applicationUrl}\">here</a> to view the application."
            }
        };
    }
}