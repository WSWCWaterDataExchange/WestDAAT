using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationLoadAllRequestHandler : IRequestHandler<OrganizationLoadAllRequest, OrganizationLoadAllResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationLoadAllRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationLoadAllResponse> Handle(OrganizationLoadAllRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.OrganizationLoadAllRequest>();
        var accessorResponse = (CommonContracts.OrganizationLoadAllResponse)await OrganizationAccessor.Load(accessorRequest);
        return accessorResponse.Map<OrganizationLoadAllResponse>();
    }
}