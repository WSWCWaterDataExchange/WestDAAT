using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmittedEventHandler : IRequestHandler<WaterConservationApplicationSubmittedEvent, EventResponseBase>
{
    public INotificationFilteringEngine NotificationFilteringEngine { get; }

    public INotificationFormattingEngine NotificationFormattingEngine { get; }

    public ILogger Logger { get; }

    public WaterConservationApplicationSubmittedEventHandler(
        INotificationFilteringEngine notificationFilteringEngine,
        INotificationFormattingEngine notificationFormattingEngine,
        ILogger<WaterConservationApplicationSubmittedEventHandler> logger
    )
    {
        NotificationFilteringEngine = notificationFilteringEngine;
        NotificationFormattingEngine = notificationFormattingEngine;
        Logger = logger;
    }

    public async Task<EventResponseBase> Handle(WaterConservationApplicationSubmittedEvent @event)
    {
        var dto = DtoMapper.Map<DTO.WaterConservationApplicationSubmittedEvent>(@event);
        var notificationMetas = await NotificationFilteringEngine.Filter(dto);
        

        return new EventResponseBase();
    }
}