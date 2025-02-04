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
        dtoRequest.ApplicantUserId = ((UserContext)_contextUtility.GetContext()).UserId;

        // verify in-progress wca does not already exist; if it does, return the id
        var inProgressWcaRequest = dtoRequest.Map<Common.DataContracts.InProgressApplicationExistsLoadRequest>();
        var inProgressWcaResponse = (Common.DataContracts.InProgressApplicationExistsLoadResponse)await _applicationAccessor.Load(inProgressWcaRequest);

        if (inProgressWcaResponse.InProgressApplicationId.HasValue)
        {
            return new WaterConservationApplicationCreateResponse
            {
                WaterConservationApplicationId = inProgressWcaResponse.InProgressApplicationId.Value
            };
        }

        // hydrate request (display id)
        await _applicationFormattingEngine.FormatStoreRequest(dtoRequest);

        // save to db

        throw new NotImplementedException();
    }
}
