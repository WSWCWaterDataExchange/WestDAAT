using System.Transactions;
using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionRequestHandler : IRequestHandler<WaterConservationApplicationSubmissionRequest, ApplicationStoreResponseBase>
{
    private readonly ILogger _logger;

    private readonly IApplicationAccessor _applicationAccessor;

    private readonly IMessageBusUtility _messageBusUtility;

    public WaterConservationApplicationSubmissionRequestHandler(ILogger<WaterConservationApplicationSubmissionRequestHandler> logger, IApplicationAccessor applicationAccessor,
        IMessageBusUtility messageBusUtility)
    {
        _logger = logger;
        _applicationAccessor = applicationAccessor;
        _messageBusUtility = messageBusUtility;
    }

    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationSubmissionRequest request)
    {
        var dtoRequest = request.Map<DTO.WaterConservationApplicationSubmissionRequest>();
        await _applicationAccessor.Store(dtoRequest);

        try
        {
            // User should see success message even if the message bus fails. Catch and log the exception.
            await _messageBusUtility.SendMessageAsync(Queues.ConservationApplicationStatusChanged, new WaterConservationApplicationSubmittedEvent
            {
                ApplicationId = request.WaterConservationApplicationId,
            });
        }
        catch (Exception ex)
        {
            var logMsg = $"Error queuing {nameof(WaterConservationApplicationSubmittedEvent)} message for application id: {request.WaterConservationApplicationId}";
            _logger.LogError(ex, logMsg);
        }

        return new ApplicationStoreResponseBase();
    }
}