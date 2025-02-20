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

    public IWaterAllocationAccessor WaterAllocationAccessor { get; }

    public OrganizationFundingDetailsRequestHandler(IOrganizationAccessor organizationAccessor, IWaterAllocationAccessor waterAllocationAccessor)
    {
        OrganizationAccessor = organizationAccessor;
        WaterAllocationAccessor = waterAllocationAccessor;
    }

    public async Task<OrganizationFundingDetailsResponse> Handle(OrganizationFundingDetailsRequest request)
    {
        // get the funding org id from the water right
        var waterRightFundingOrgDetailsResponse = await WaterAllocationAccessor.GetWaterRightFundingOrgDetailsByNativeId(request.WaterRightNativeId);

        // get the funding org details
        var getFundingOrgDetailsRequest = waterRightFundingOrgDetailsResponse.Map<CommonContracts.OrganizationFundingDetailsRequest>();
        var getFundingOrgDetailsResponse = (CommonContracts.OrganizationFundingDetailsResponse)await OrganizationAccessor.Load(getFundingOrgDetailsRequest);
        return getFundingOrgDetailsResponse.Map<OrganizationFundingDetailsResponse>();
    }
}
