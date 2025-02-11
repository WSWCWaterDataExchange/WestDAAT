using WesternStatesWater.Shared.Resolver;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;

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
        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}