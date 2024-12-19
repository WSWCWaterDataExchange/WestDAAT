using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The NotificationFormattingEngine is responsible for formatting the notification meta into a
/// format that can be sent to the recipients. Notification examples include Email, SMS, etc.
/// </summary>
public interface INotificationFormattingEngine : IServiceContractBase
{
    DTO.NotificationBase[] Format<T>(T[] notificationMetas);
}