using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

internal class OrganizationAccessor : AccessorBase, IOrganizationAccessor
{
    public OrganizationAccessor(ILogger<OrganizationAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
    }
    
    private readonly EF.IDatabaseContextFactory _databaseContextFactory;

    public async Task<OrganizationLoadResponseBase> Load(OrganizationLoadRequestBase request)
    {
        return request switch
        {
            OrganizationLoadAllRequest req => await GetAllOrganizations(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<OrganizationLoadAllResponse> GetAllOrganizations(OrganizationLoadAllRequest request)
    {
        // temporary implementation
        await Task.CompletedTask;
        var organizations = new OrganizationListItem[]
        {
            new OrganizationListItem()
            {
                OrganizationId = Guid.NewGuid(),
                Name = "organization1",
                UserCount = 1,
                EmailDomain = "organization1.com",
            },
        };
        
        return new OrganizationLoadAllResponse()
        {
            Organizations = organizations
        };
    }
}