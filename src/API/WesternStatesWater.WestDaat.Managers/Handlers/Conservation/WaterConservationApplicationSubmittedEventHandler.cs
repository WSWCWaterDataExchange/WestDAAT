using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.DataContracts;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmittedEventHandler : IRequestHandler<WaterConservationApplicationSubmittedEvent, EventResponseBase>
{
    public IApplicationAccessor ApplicationAccessor { get; }

    public ILogger Logger { get; }

    public WaterConservationApplicationSubmittedEventHandler(IApplicationAccessor applicationAccessor, ILogger<WaterConservationApplicationSubmittedEventHandler> logger)
    {
        ApplicationAccessor = applicationAccessor;
        Logger = logger;
    }

    public async Task<EventResponseBase> Handle(WaterConservationApplicationSubmittedEvent request)
    {
        await Task.CompletedTask;
        Logger.LogInformation("WaterConservationApplicationSubmittedEvent handled. Id: {ApplicationId}", request.ApplicationId);
        return new EventResponseBase();
    }
}