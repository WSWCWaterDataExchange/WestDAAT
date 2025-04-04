using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationRecommendedEventHandler : NotificationEventHandlerBase, IRequestHandler<WaterConservationApplicationRecommendedEvent, EventResponseBase>
{
    public INotificationFilteringEngine NotificationFilteringEngine { get; }

    public INotificationFormattingEngine NotificationFormattingEngine { get; }

    public ILogger Logger { get; }

    public WaterConservationApplicationRecommendedEventHandler(
        INotificationFilteringEngine notificationFilteringEngine,
        INotificationFormattingEngine notificationFormattingEngine,
        ILogger<WaterConservationApplicationRecommendedEventHandler> logger,
        IEmailNotificationSdk emailSdk
    ) : base(logger, emailSdk)
    {
        NotificationFilteringEngine = notificationFilteringEngine;
        NotificationFormattingEngine = notificationFormattingEngine;
        Logger = logger;
    }

    public async Task<EventResponseBase> Handle(WaterConservationApplicationRecommendedEvent @event)
    {
        var dto = @event.Map<DTO.WaterConservationApplicationRecommendedEvent>();
        var notificationMetas = await NotificationFilteringEngine.Filter(dto);

        var notifications = NotificationFormattingEngine.Format(notificationMetas);

        await Send(notifications);

        return new EventResponseBase();
    }
}