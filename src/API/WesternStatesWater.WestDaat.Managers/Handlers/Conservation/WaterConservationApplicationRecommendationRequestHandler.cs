using Microsoft.Extensions.Logging;
using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationRecommendationRequestHandler : IRequestHandler<WaterConservationApplicationRecommendationRequest, ApplicationStoreResponseBase>
{
    private readonly ILogger _logger;

    private readonly IApplicationAccessor _applicationAccessor;

    public WaterConservationApplicationRecommendationRequestHandler(ILogger<WaterConservationApplicationRecommendationRequestHandler> logger, IApplicationAccessor applicationAccessor)
    {
        _logger = logger;
        _applicationAccessor = applicationAccessor;
    }
    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationRecommendationRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}