using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

internal class UserAccessor : AccessorBase, IUserAccessor
{
    public UserAccessor(ILogger<UserAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
    }

    private readonly EF.IDatabaseContextFactory _databaseContextFactory;

    public async Task<UserLoadRolesResponse> GetUserRoles(UserLoadRolesRequest request)
    {
        // mock implementation

        await Task.CompletedTask;
        var userId = Guid.NewGuid();
        var userRoles = new string[] { "role1", "role2" };
        var userOrganizationRoles = new string[] { "organizationRole1", "organizationRole2" };

        return new UserLoadRolesResponse
        {
            UserId = userId,
            UserRoles = userRoles,
            UserOrganizationRoles = userOrganizationRoles
        };
    }
}