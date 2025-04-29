using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationNoteCreateRequestHandler : IRequestHandler<WaterConservationApplicationNoteCreateRequest, WaterConservationApplicationNoteCreateResponse>
{
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IContextUtility _contextUtility;

    public WaterConservationApplicationNoteCreateRequestHandler(
        IContextUtility contextUtility,
        IApplicationAccessor applicationAccessor
    )
    {
        _contextUtility = contextUtility;
        _applicationAccessor = applicationAccessor;
    }
    
    public async Task<WaterConservationApplicationNoteCreateResponse> Handle(WaterConservationApplicationNoteCreateRequest request)
    {
        var userContext = _contextUtility.GetRequiredContext<UserContext>();
        var accessorRequest = request.Map<Common.DataContracts.WaterConservationApplicationNoteCreateRequest>();
        accessorRequest.CreatedByUserId = userContext.UserId;
        var accessorResponse = await _applicationAccessor.Store(accessorRequest);
        return accessorResponse.Map<WaterConservationApplicationNoteCreateResponse>();
    }
}