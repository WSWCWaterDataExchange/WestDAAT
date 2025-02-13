using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationMemberAddRequestHandler : IRequestHandler<OrganizationMemberAddRequest, OrganizationMemberAddResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationMemberAddRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationMemberAddResponse> Handle(OrganizationMemberAddRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.OrganizationMemberAddRequest>();
        var accessorResponse = (CommonContracts.OrganizationMemberAddResponse)await OrganizationAccessor.Store(accessorRequest);
        return accessorResponse.Map<OrganizationMemberAddResponse>();
    }
}