using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

/// <summary>
/// The NotificationFilteringEngine is responsible for determining the recipients of a notification.
/// Additionally, it constructs the notification meta, which includes all necessary data for sending the notification.
/// </summary>
public interface INotificationFilteringEngine : IServiceContractBase
{
    Task<DTO.NotificationMetaBase[]> Filter<T>(T filterEvent);
}