using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationSummaryListRequestHandler : IRequestHandler<OrganizationSummaryListRequest, OrganizationSummaryListResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationSummaryListRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationSummaryListResponse> Handle(OrganizationSummaryListRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.OrganizationDetailsListRequest>();
        var accessorResponse = (Common.DataContracts.OrganizationDetailsListResponse)await OrganizationAccessor.Load(accessorRequest);
        return accessorResponse.Map<OrganizationSummaryListResponse>();
    }
}