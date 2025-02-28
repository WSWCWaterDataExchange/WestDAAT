using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class WaterConservationApplicationSubmissionRequestHandler : IRequestHandler<WaterConservationApplicationSubmissionRequest, ApplicationStoreResponseBase>
{
    private readonly IApplicationAccessor _applicationAccessor;

    public WaterConservationApplicationSubmissionRequestHandler(IApplicationAccessor applicationAccessor)
    {
        _applicationAccessor = applicationAccessor;
    }

    public async Task<ApplicationStoreResponseBase> Handle(WaterConservationApplicationSubmissionRequest request)
    {
        var dtoRequest = request.Map<Common.DataContracts.WaterConservationApplicationSubmissionRequest>();
        await _applicationAccessor.Store(dtoRequest);

        return new ApplicationStoreResponseBase();
    }
}
