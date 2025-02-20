using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;
using WesternStatesWater.WestDaat.Managers.Mapping;

using CommonContracts = WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Managers.Handlers.Admin;

public class OrganizationFundingDetailsRequestHandler : IRequestHandler<OrganizationFundingDetailsRequest, OrganizationFundingDetailsResponse>
{
    public IOrganizationAccessor OrganizationAccessor { get; }

    public OrganizationFundingDetailsRequestHandler(IOrganizationAccessor organizationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
    }

    public async Task<OrganizationFundingDetailsResponse> Handle(OrganizationFundingDetailsRequest request)
    {
        var dtoRequest = request.Map<CommonContracts.OrganizationFundingDetailsRequest>();
        var dtoResponse = (CommonContracts.OrganizationFundingDetailsResponse)await OrganizationAccessor.Load(dtoRequest);
        return dtoResponse.Map<OrganizationFundingDetailsResponse>();
    }
}
