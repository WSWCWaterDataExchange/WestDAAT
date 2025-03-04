using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationMemberUpdateRequestHandler : IRequestHandler<OrganizationMemberUpdateRequest, OrganizationMemberUpdateResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationMemberUpdateRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationMemberUpdateResponse> Handle(OrganizationMemberUpdateRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.OrganizationMemberUpdateRequest>();
        var accessorResponse = (Common.DataContracts.OrganizationMemberUpdateResponse)await OrganizationAccessor.Store(accessorRequest);
        return accessorResponse.Map<OrganizationMemberUpdateResponse>();
    }
}