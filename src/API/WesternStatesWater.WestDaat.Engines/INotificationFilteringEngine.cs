using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Engines;

public interface INotificationFilteringEngine : IServiceContractBase
{
    Task<DTO.NotificationMetaBase[]> Filter<T>(T filterEvent);
}