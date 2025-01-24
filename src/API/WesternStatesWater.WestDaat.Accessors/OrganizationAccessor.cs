using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class OrganizationAccessor : AccessorBase, IOrganizationAccessor
    {
        public OrganizationAccessor(ILogger<OrganizationAccessor> logger, EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory) : base(logger)
        {
            _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
        }

        private readonly EFWD.IWestDaatDatabaseContextFactory _westDaatDatabaseContextFactory;

        public async Task<OrganizationLoadResponseBase> Load(OrganizationLoadRequestBase request)
        {
            return request switch
            {
                OrganizationLoadAllRequest => await GetAllOrganizations(),
                _ => throw new NotImplementedException(
                    $"Handling of request type '{request.GetType().Name}' is not implemented.")
            };
        }

        private async Task<OrganizationLoadAllResponse> GetAllOrganizations()
        {
            await using var db = _westDaatDatabaseContextFactory.Create();

            var organizations = await db.Organizations
                .ProjectTo<OrganizationListItem>(DtoMapper.Configuration)
                .OrderBy(org => org.Name)
                .ToListAsync();

            return new OrganizationLoadAllResponse()
            {
                Organizations = organizations.ToArray()
            };
        }
    }
}