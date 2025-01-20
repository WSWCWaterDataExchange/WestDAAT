using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Accessors;

internal class UserAccessor : AccessorBase, IUserAccessor
{
    public UserAccessor(ILogger<UserAccessor> logger, EFWD.IWestDaatDatabaseContextFactory westdaatDatabaseContextFactory) : base(logger)
    {
        _westdaatDatabaseContextFactory = westdaatDatabaseContextFactory;
    }

    private readonly EFWD.IWestDaatDatabaseContextFactory _westdaatDatabaseContextFactory;

    public async Task<UserLoadResponseBase> Load(UserLoadRequestBase request)
    {
        return request switch
        {
            UserLoadRolesRequest req => await GetUserRoles(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<UserLoadRolesResponse> GetUserRoles(UserLoadRolesRequest request)
    {
        await using var db = _westdaatDatabaseContextFactory.Create();

        var user = await db.Users
            .Include(u => u.UserRoles)
            .Include(u => u.UserOrganizations)
                .ThenInclude(uor => uor.UserOrganizationRoles)
            .FirstOrDefaultAsync(u => u.ExternalAuthId == request.ExternalAuthId);

        NotFoundException.ThrowIfNull(user, $"User not found for auth id {request.ExternalAuthId}");

        return new UserLoadRolesResponse
        {
            UserId = user.Id,
            UserRoles = user.UserRoles.Select(ur => ur.Role).ToArray(),
            UserOrganizationRoles = user.UserOrganizations.SelectMany(uo => uo.UserOrganizationRoles.Select(uor => new UserOrganizationRoleDetails
            {
                OrganizationId = uo.OrganizationId,
                Role = uor.Role
            })).ToArray()
        };
    }

}