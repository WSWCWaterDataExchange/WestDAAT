using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Conservation;

public class ApplicationDashboardLoadRequestHandler : IRequestHandler<ApplicationDashboardLoadRequest, ApplicationDashboardLoadResponse>
{
    public IApplicationAccessor ApplicationAccessor { get; }

    public ApplicationDashboardLoadRequestHandler(IApplicationAccessor applicationAccessor)
    {
        ApplicationAccessor = applicationAccessor;
    }

    public async Task<ApplicationDashboardLoadResponse> Handle(ApplicationDashboardLoadRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.ApplicationDashboardLoadRequest>();
        var accessorResponse = (CommonContracts.ApplicationDashboardLoadResponse)await ApplicationAccessor.Load(accessorRequest);
        return accessorResponse.Map<ApplicationDashboardLoadResponse>();
    }
}