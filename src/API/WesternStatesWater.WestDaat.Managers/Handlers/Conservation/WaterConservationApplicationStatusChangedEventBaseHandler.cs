using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationStatusChangedEventBaseHandler : NotificationEventHandlerBase,
    IRequestHandler<WaterConservationApplicationStatusChangedEventBase, EventResponseBase>
{
    public INotificationFilteringEngine NotificationFilteringEngine { get; }

    public INotificationFormattingEngine NotificationFormattingEngine { get; }

    public ILogger Logger { get; }

    public WaterConservationApplicationStatusChangedEventBaseHandler(
        INotificationFilteringEngine notificationFilteringEngine,
        INotificationFormattingEngine notificationFormattingEngine,
        ILogger<WaterConservationApplicationStatusChangedEventBaseHandler> logger,
        IEmailNotificationSdk emailSdk
    ) : base(logger, emailSdk)
    {
        NotificationFilteringEngine = notificationFilteringEngine;
        NotificationFormattingEngine = notificationFormattingEngine;
        Logger = logger;
    }

    public async Task<EventResponseBase> Handle(WaterConservationApplicationStatusChangedEventBase @event)
    {
        var dto = @event.Map<DTO.WaterConservationApplicationStatusChangedEventBase>();
        var notificationMetas = await NotificationFilteringEngine.Filter(dto);

        var notifications = NotificationFormattingEngine.Format(notificationMetas);

        await Send(notifications);

        return new EventResponseBase();
    }
}