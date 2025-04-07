using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationRecommendationRequestHandler
    : IRequestHandler<WaterConservationApplicationRecommendationRequest, ApplicationStoreResponseBase>
{
    private readonly ILogger<WaterConservationApplicationRecommendationRequestHandler> _logger;
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IContextUtility _contextUtility;
    private readonly IMessageBusUtility _messageBusUtility;

    public WaterConservationApplicationRecommendationRequestHandler(
        ILogger<WaterConservationApplicationRecommendationRequestHandler> logger,
        IContextUtility contextUtility,
        IApplicationAccessor applicationAccessor,
        IMessageBusUtility messageBusUtility
    )
    {
        _logger = logger;
        _contextUtility = contextUtility;
        _applicationAccessor = applicationAccessor;
        _messageBusUtility = messageBusUtility;
    }

    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationRecommendationRequest request)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var accessorRequest = request.Map<Common.DataContracts.WaterConservationApplicationRecommendationRequest>();
        accessorRequest.RecommendedByUserId = userContext.UserId;

        await _applicationAccessor.Store(accessorRequest);

        try
        {
            // Try/catch so recommendation call succeeds even if queuing the event message fails
            await _messageBusUtility.SendMessageAsync<WaterConservationApplicationStatusChangedEventBase>(Queues.ConservationApplicationStatusChanged,
                new WaterConservationApplicationRecommendedEvent
                {
                    ApplicationId = request.WaterConservationApplicationId,
                });
        }
        catch (Exception ex)
        {
            var logMsg = $"Error queuing {nameof(WaterConservationApplicationRecommendedEvent)} message for application id: {request.WaterConservationApplicationId}";
            _logger.LogError(ex, logMsg);
        }

        return new ApplicationStoreResponseBase();
    }
}