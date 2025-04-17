using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers;

public abstract class NotificationEventHandlerBase
{
    private readonly ILogger _logger;

    private readonly IEmailNotificationSdk _emailNotificationSdk;

    internal NotificationEventHandlerBase(ILogger logger, IEmailNotificationSdk emailNotificationSdk)
    {
        _logger = logger;
        _emailNotificationSdk = emailNotificationSdk;
    }

    internal async Task Send(DTO.NotificationBase[] notifications)
    {
        foreach (var notification in notifications)
        {
            try
            {
                await Send(notification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send {Type}", notification.GetType());
            }
        }
    }

    private Task Send(DTO.NotificationBase notification)
    {
        return notification switch
        {
            DTO.EmailNotification email => _emailNotificationSdk.SendEmail(email.EmailRequest),
            _ => throw new NotImplementedException($"Sending notifications of type " +
                                                   $"'{notification.GetType()}' has not been implemented.")
        };
    }
}