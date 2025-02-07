using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Accessors
{
    internal class OrganizationAccessor : AccessorBase, IOrganizationAccessor
    {
        private readonly EFWD.IWestDaatDatabaseContextFactory _westDaatDatabaseContextFactory;

        public OrganizationAccessor(ILogger<OrganizationAccessor> logger, EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory) : base(logger)
        {
            _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
        }

        public async Task<OrganizationLoadResponseBase> Load(OrganizationLoadRequestBase request)
        {
            return request switch
            {
                OrganizationLoadAllRequest => await GetAllOrganizations(),
                OrganizationLoadDetailsRequest req => await GetOrganizationDetails(req),
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

        private async Task<OrganizationLoadDetailsResponse> GetOrganizationDetails(OrganizationLoadDetailsRequest request)
        {
            await using var db = _westDaatDatabaseContextFactory.Create();

            var organization = await db.Organizations
                .ProjectTo<OrganizationSlim>(DtoMapper.Configuration)
                .FirstOrDefaultAsync(org => org.OrganizationId == request.OrganizationId);

            if (organization == null)
            {
                throw new WestDaatException($"Organization with ID '{request.OrganizationId}' not found.");
            }

            return new OrganizationLoadDetailsResponse
            {
                Organization = organization,
            };
        }
    }
}