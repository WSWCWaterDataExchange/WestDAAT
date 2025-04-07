using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionUpdateRequestHandler
    : IRequestHandler<WaterConservationApplicationSubmissionUpdateRequest, WaterConservationApplicationSubmissionUpdateResponse>
{
    private readonly IContextUtility _contextUtility;

    private readonly IApplicationAccessor _applicationAccessor;

    public WaterConservationApplicationSubmissionUpdateRequestHandler(
        IContextUtility contextUtility,
        IApplicationAccessor applicationAccessor)
    {
        _contextUtility = contextUtility;
        _applicationAccessor = applicationAccessor;
    }

    public async Task<WaterConservationApplicationSubmissionUpdateResponse> Handle(WaterConservationApplicationSubmissionUpdateRequest request)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();

        var dtoRequest = request.Map<Common.DataContracts.WaterConservationApplicationSubmissionUpdateRequest>();
        dtoRequest.UpdatedByUserId = userContext.UserId;

        var dtoResponse = await _applicationAccessor.Store(dtoRequest);

        return dtoResponse.Map<WaterConservationApplicationSubmissionUpdateResponse>();
    }
}
