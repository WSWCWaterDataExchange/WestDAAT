using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;
using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationListDetailsRequestHandler : IRequestHandler<OrganizationListDetailsRequest, OrganizationListDetailsResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationListDetailsRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationListDetailsResponse> Handle(OrganizationListDetailsRequest request)
    {
        var accessorRequest = request.Map<CommonContracts.OrganizationListDetailsRequest>();
        var accessorResponse = (CommonContracts.OrganizationListDetailsResponse)await OrganizationAccessor.Load(accessorRequest);
        return accessorResponse.Map<OrganizationListDetailsResponse>();
    }
}