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
        var organizations = new List<OrganizationListDetails>
        {
            new OrganizationListDetails()
            {
                OrganizationUuid = Guid.NewGuid().ToString(),
                OrganizationName = "organization1",
                OrganizationDomainName = "organization1.com",
                UserCount = 1
            },
        };
        
        return new OrganizationLoadAllResponse()
        {
            Organizations = organizations
        };
    }
}