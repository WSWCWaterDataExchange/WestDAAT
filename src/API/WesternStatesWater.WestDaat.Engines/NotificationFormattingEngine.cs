namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : INotificationFormattingEngine
{
    public DTO.NotificationBase[] Format<T>(T[] notificationMetas)
    {
        return notificationMetas switch
        {
            _ => throw new NotImplementedException()
        };
    }
}