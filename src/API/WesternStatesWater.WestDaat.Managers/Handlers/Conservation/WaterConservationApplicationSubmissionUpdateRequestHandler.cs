using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionUpdateRequestHandler
    : IRequestHandler<WaterConservationApplicationSubmissionUpdateRequest, ApplicationStoreResponseBase>
{
    private readonly IApplicationAccessor _applicationAccessor;

    public WaterConservationApplicationSubmissionUpdateRequestHandler(IApplicationAccessor applicationAccessor)
    {
        _applicationAccessor = applicationAccessor;
    }

    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationSubmissionUpdateRequest request)
    {
        var dtoRequest = request.Map<Common.DataContracts.WaterConservationApplicationSubmissionUpdateRequest>();
        await _applicationAccessor.Store(dtoRequest);

        return new ApplicationStoreResponseBase();
    }
}
