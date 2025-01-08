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
        var userRoleNames = await Task.FromResult(new string[] { "role1", "role2" });

        return new UserLoadRolesResponse
        {
            RoleNames = userRoleNames
        };
    }
}