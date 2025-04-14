using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
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
        await Task.CompletedTask;
        throw new NotImplementedException("made it to handler");
    }
}