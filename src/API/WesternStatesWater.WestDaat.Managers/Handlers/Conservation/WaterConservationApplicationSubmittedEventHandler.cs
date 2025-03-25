using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Engines;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmittedEventHandler : IRequestHandler<WaterConservationApplicationSubmittedEvent, EventResponseBase>
{
    public INotificationFilteringEngine FilteringEngine { get; }

    public INotificationFormattingEngine FormattingEngine { get; }

    public ILogger Logger { get; }

    public WaterConservationApplicationSubmittedEventHandler(
        INotificationFilteringEngine filteringEngine,
        INotificationFormattingEngine formattingEngine,
        ILogger<WaterConservationApplicationSubmittedEventHandler> logger
    )
    {
        FilteringEngine = filteringEngine;
        FormattingEngine = formattingEngine;
        Logger = logger;
    }

    public async Task<EventResponseBase> Handle(WaterConservationApplicationSubmittedEvent @event)
    {
        await FilteringEngine.Filter(@event);
        
        
        // var dto = DtoMapper.Map<DTO.FriendRequestSentEvent>(@event);
        // var notificationMetas = await _notificationFilteringEngine.Filter(dto);
        // var notifications = _notificationFormattingEngine.Format(notificationMetas);
        //
        // await Send(notifications);
        //
        // return new CLI.ResponseBase();
    }
}