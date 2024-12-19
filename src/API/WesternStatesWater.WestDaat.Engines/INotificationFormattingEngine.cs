using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

public interface INotificationFormattingEngine : IServiceContractBase
{
    DTO.NotificationBase[] Format<T>(T[] notificationMetas);
}