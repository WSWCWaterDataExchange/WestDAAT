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

        private readonly EF.IDatabaseContextFactory _wadeDbContextFactory;

        public OrganizationAccessor(ILogger<OrganizationAccessor> logger,
            EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory,
            EF.IDatabaseContextFactory wadeDbContextFactory) : base(logger)
        {
            _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
            _wadeDbContextFactory = wadeDbContextFactory;
        }

        public async Task<OrganizationLoadResponseBase> Load(OrganizationLoadRequestBase request)
        {
            return request switch
            {
                OrganizationDetailsListRequest => await GetOrganizationDetailsList(),
                OrganizationLoadDetailsRequest req => await GetOrganizationDetails(req),
                OrganizationFundingDetailsRequest req => await GetOrganizationFundingDetails(req),
                UserOrganizationLoadRequest req => await GetUserOrganizations(req),
                _ => throw new NotImplementedException(
                    $"Handling of request type '{request.GetType().Name}' is not implemented.")
            };
        }

        private async Task<OrganizationDetailsListResponse> GetOrganizationDetailsList()
        {
            await using var db = _westDaatDatabaseContextFactory.Create();

            var organizations = await db.Organizations
                .ProjectTo<OrganizationListItem>(DtoMapper.Configuration)
                .OrderBy(org => org.Name)
                .ToArrayAsync();

            return new OrganizationDetailsListResponse
            {
                Organizations = organizations
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

        private async Task<OrganizationFundingDetailsResponse> GetOrganizationFundingDetails(OrganizationFundingDetailsRequest request)
        {
            await using var westDaatDb = _westDaatDatabaseContextFactory.Create();

            var organizationFundingDetails = await westDaatDb.Organizations
                .ProjectTo<OrganizationFundingDetails>(DtoMapper.Configuration)
                .SingleAsync(org => org.OrganizationId == request.OrganizationId);

            return new OrganizationFundingDetailsResponse
            {
                Organization = organizationFundingDetails
            };
        }

        private async Task<UserOrganizationLoadResponse> GetUserOrganizations(UserOrganizationLoadRequest request)
        {
            await using var db = _westDaatDatabaseContextFactory.Create();

            var organizations = await db.Organizations
                .Where(org => org.UserOrganizations.Any(uo => uo.UserId == request.UserId))
                .ProjectTo<OrganizationSlim>(DtoMapper.Configuration)
                .ToArrayAsync();

            return new UserOrganizationLoadResponse
            {
                Organizations = organizations
            };
        }

        public async Task<OrganizationStoreResponseBase> Store(OrganizationStoreRequestBase request)
        {
            return request switch
            {
                OrganizationMemberAddRequest req => await AddOrganizationMember(req),
                _ => throw new NotImplementedException(
                    $"Handling of request type '{request.GetType().Name}' is not implemented.")
            };
        }

        private async Task<OrganizationMemberAddResponse> AddOrganizationMember(OrganizationMemberAddRequest request)
        {
            await using var db = _westDaatDatabaseContextFactory.Create();

            var userOrganization = new EFWD.UserOrganization
            {
                OrganizationId = request.OrganizationId,
                UserId = request.UserId,
                UserOrganizationRoles =
                [
                    new EFWD.UserOrganizationRole
                    {
                        Role = request.Role
                    }
                ]
            };

            await db.UserOrganizations.AddAsync(userOrganization);
            await db.SaveChangesAsync();

            return new OrganizationMemberAddResponse();
        }
    }
}