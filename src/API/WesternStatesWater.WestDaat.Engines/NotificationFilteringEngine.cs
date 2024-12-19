namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FilteringEngine : INotificationFilteringEngine
{
    public Task<DTO.NotificationMetaBase[]> Filter<T>(T filterEvent)
    {
        return filterEvent switch
        {
            _ => throw new NotImplementedException()
        };
    }
}