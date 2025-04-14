using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionNoteCreateRequestHandler : IRequestHandler<WaterConservationApplicationSubmissionNoteCreateRequest, WaterConservationApplicationSubmissionNoteCreateResponse>
{
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IContextUtility _contextUtility;

    public WaterConservationApplicationSubmissionNoteCreateRequestHandler(
        IContextUtility contextUtility,
        IApplicationAccessor applicationAccessor
    )
    {
        _contextUtility = contextUtility;
        _applicationAccessor = applicationAccessor;
    }
    
    public async Task<WaterConservationApplicationSubmissionNoteCreateResponse> Handle(WaterConservationApplicationSubmissionNoteCreateRequest request)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var accessorRequest = request.Map<Common.DataContracts.WaterConservationApplicationSubmissionNoteCreateRequest>();
        accessorRequest.CreatedByUserId = userContext.UserId;
        var accessorResponse = await _applicationAccessor.Store(accessorRequest);
        return accessorResponse.Map<WaterConservationApplicationSubmissionNoteCreateResponse>();
    }
}