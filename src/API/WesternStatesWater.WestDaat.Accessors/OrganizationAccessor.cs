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
                .ProjectTo<OrganizationSummaryItem>(DtoMapper.Configuration)
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
                .Where(org => org.Id == request.OrganizationId)
                .ProjectTo<OrganizationFundingDetails>(DtoMapper.Configuration)
                .SingleAsync();

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
                .ProjectTo<OrganizationSummaryItem>(DtoMapper.Configuration)
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
                OrganizationMemberRemoveRequest req => await RemoveOrganizationMember(req),
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

        private async Task<OrganizationMemberRemoveResponse> RemoveOrganizationMember(OrganizationMemberRemoveRequest request)
        {
            await Task.CompletedTask;
            return new OrganizationMemberRemoveResponse();
        }
    }
}