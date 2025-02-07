using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationCreateRequestHandler :
    IRequestHandler<WaterConservationApplicationCreateRequest, WaterConservationApplicationCreateResponse>
{
    private readonly IApplicationFormattingEngine _applicationFormattingEngine;

    private readonly IApplicationAccessor _applicationAccessor;

    private readonly IContextUtility _contextUtility;

    public WaterConservationApplicationCreateRequestHandler(IApplicationFormattingEngine applicationFormattingEngine,
        IApplicationAccessor applicationAccessor,
        IContextUtility contextUtility)
    {
        _applicationFormattingEngine = applicationFormattingEngine;
        _applicationAccessor = applicationAccessor;
        _contextUtility = contextUtility;
    }

    public async Task<WaterConservationApplicationCreateResponse> Handle(WaterConservationApplicationCreateRequest request)
    {
        var dtoRequest = request.Map<Common.DataContracts.WaterConservationApplicationCreateRequest>();
        dtoRequest.ApplicantUserId = _contextUtility.GetRequiredContext<UserContext>().UserId;

        // if a WCA does already exists, return the id
        var inProgressWcaRequest = dtoRequest.Map<Common.DataContracts.UnsubmittedApplicationExistsLoadRequest>();
        var inProgressWcaResponse = (Common.DataContracts.UnsubmittedApplicationExistsLoadResponse)await _applicationAccessor.Load(inProgressWcaRequest);

        if (inProgressWcaResponse.InProgressApplicationId.HasValue)
        {
            return new WaterConservationApplicationCreateResponse
            {
                WaterConservationApplicationId = inProgressWcaResponse.InProgressApplicationId.Value
            };
        }

        // hydrate request
        var formatDisplayIdRequest = dtoRequest.Map<Common.DataContracts.ApplicationFormatDisplayIdRequest>();
        var formatDisplayIdResponse = (Common.DataContracts.ApplicationFormatDisplayIdResponse)await _applicationFormattingEngine.Format(formatDisplayIdRequest);

        dtoRequest.ApplicationDisplayId = formatDisplayIdResponse.DisplayId;

        // save to db
        var dtoResponse = (Common.DataContracts.WaterConservationApplicationCreateResponse)await _applicationAccessor.Store(dtoRequest);

        return dtoResponse.Map<WaterConservationApplicationCreateResponse>();
    }
}
