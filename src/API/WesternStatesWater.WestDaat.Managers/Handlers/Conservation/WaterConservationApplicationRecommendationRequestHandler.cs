using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationRecommendationRequestHandler 
    : IRequestHandler<WaterConservationApplicationRecommendationRequest, ApplicationStoreResponseBase>
{
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IContextUtility _contextUtility;

    public WaterConservationApplicationRecommendationRequestHandler(
        IContextUtility contextUtility, 
        IApplicationAccessor applicationAccessor)
    {
        _contextUtility = contextUtility;
        _applicationAccessor = applicationAccessor;
    }

    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationRecommendationRequest request)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var accessorRequest = request.Map<Common.DataContracts.WaterConservationApplicationRecommendationRequest>();
        accessorRequest.RecommendedByUserId = userContext.UserId;

        await _applicationAccessor.Store(accessorRequest);

        return new ApplicationStoreResponseBase();
    }
}