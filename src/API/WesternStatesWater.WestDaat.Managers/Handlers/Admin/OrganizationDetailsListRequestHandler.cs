using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using WesternStatesWater.WestDaat.Utilities;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationDetailsListRequestHandler : IRequestHandler<OrganizationDetailsListRequest, OrganizationDetailsListResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationDetailsListRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationDetailsListResponse> Handle(OrganizationDetailsListRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.OrganizationDetailsListRequest>();
        var accessorResponse = (CommonContracts.OrganizationDetailsListResponse)await OrganizationAccessor.Load(accessorRequest);
        return accessorResponse.Map<OrganizationDetailsListResponse>();
    }
}