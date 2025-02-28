using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationMemberRemoveRequestHandler : IRequestHandler<OrganizationMemberRemoveRequest, OrganizationMemberRemoveResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }
    
    public OrganizationMemberRemoveRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationMemberRemoveResponse> Handle(OrganizationMemberRemoveRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.OrganizationMemberRemoveRequest>();
        var accessorResponse = (CommonContracts.OrganizationMemberRemoveResponse)await OrganizationAccessor.Store(accessorRequest);
        return accessorResponse.Map<OrganizationMemberRemoveResponse>();
    }
}