using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationListSummaryRequestHandler : IRequestHandler<OrganizationListSummaryRequest, OrganizationListSummaryResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationListSummaryRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationListSummaryResponse> Handle(OrganizationListSummaryRequest request)
    {
        var accessorRequest = request.Map<Common.DataContracts.OrganizationListDetailsRequest>();
        var accessorResponse = (Common.DataContracts.OrganizationListDetailsResponse)await OrganizationAccessor.Load(accessorRequest);
        return accessorResponse.Map<OrganizationListSummaryResponse>();
    }
}