using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

internal class SecurityUtility : ISecurityUtility
{
    public string[] Get(PermissionsGetRequestBase request)
    {
        return request switch
        {
            RolePermissionsGetRequest req => GetRolePermission(req),
            UserPermissionsGetRequestBase req => GetUserPermission(req),
            _ => throw new InvalidOperationException($"Request type '{request.GetType().Name}' is not supported.")
        };
    }

    private static string[] GetRolePermission(RolePermissionsGetRequest request)
    {
        RolePermissions.TryGetValue(request.Role, out var permissions);
        return permissions ?? throw new InvalidOperationException($"Role '{request.Role}' is not supported.");
    }

    private static string[] GetUserPermission(UserPermissionsGetRequestBase request)
    {
        return request.Context switch
        {
            AnonymousContext => [],
            UserContext => GetUserContextPermissions(request),
            _ => throw new InvalidOperationException($"Context type '{request.Context.GetType().Name}' is not supported.")
        };
    }

    private static string[] GetUserContextPermissions(UserPermissionsGetRequestBase request)
    {
        // If global admin return all permissions.
        if (((UserContext)request.Context).Roles.Contains(Roles.GlobalAdmin))
        {
            return Permissions.AllPermissions();
        }

        return request switch
        {
            UserPermissionsGetRequest req => GetPermissions(req),
            UserOrganizationPermissionsGetRequest req => GetOrganizationPermissions(req),
            _ => throw new InvalidOperationException($"Request type '{request.GetType().Name}' is not supported.")
        };
    }

    private static string[] GetPermissions(UserPermissionsGetRequest request)
    {
        var userContext = (UserContext)request.Context;
        var uniquePermissions = new HashSet<string>();
        foreach (var role in userContext.Roles)
        {
            if (RolePermissions.TryGetValue(role, out var permissions))
            {
                uniquePermissions.UnionWith(permissions);
            }
        }

        return uniquePermissions.ToArray();
    }

    private static string[] GetOrganizationPermissions(UserOrganizationPermissionsGetRequest request)
    {
        var userContext = (UserContext)request.Context;
        var organizationRoles = userContext.OrganizationRoles.FirstOrDefault(or =>
            or.OrganizationId == request.OrganizationId || request.OrganizationId == null
        );

        // If the user is not a member of the organization, they have no roles
        var organizationRoleNames = organizationRoles?.RoleNames ?? [];

        var uniquePermissions = new HashSet<string>();
        foreach (var role in organizationRoleNames)
        {
            if (RolePermissions.TryGetValue(role, out var permissions))
            {
                uniquePermissions.UnionWith(permissions);
            }
        }

        return uniquePermissions.ToArray();
    }

    private static readonly Dictionary<string, string[]> RolePermissions = new()
    {
        {
            Roles.Member,
            [
                Permissions.ApplicationApprove,
                Permissions.ApplicationReview,
                Permissions.OrganizationApplicationDashboardLoad
            ]
        },
        {
            Roles.TechnicalReviewer,
            [
                Permissions.ApplicationReview,
                Permissions.ApplicationUpdate,
                Permissions.OrganizationApplicationDashboardLoad,
            ]
        },
        {
            Roles.OrganizationAdmin,
            [
                Permissions.ApplicationApprove,
                Permissions.ApplicationReview,
                Permissions.ApplicationUpdate,
                Permissions.OrganizationApplicationDashboardLoad,
                Permissions.OrganizationMemberAdd,
                Permissions.OrganizationMemberRemove,
                Permissions.OrganizationMemberUpdate,
                Permissions.OrganizationUserList,
                Permissions.UserSearch
            ]
        },
        {
            Roles.GlobalAdmin,
            Permissions.AllPermissions()
        }
    };
}