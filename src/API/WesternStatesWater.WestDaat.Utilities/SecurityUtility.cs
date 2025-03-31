using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Utilities;

internal class SecurityUtility : ISecurityUtility
{
    public string[] Get(PermissionsGetRequestBase request)
    {
        return request.Context switch
        {
            AnonymousContext => [],
            UserContext => GetUserContextPermissions(request),
            _ => throw new InvalidOperationException($"Context type '{request.Context.GetType().Name}' is not supported.")
        };
    }

    private static string[] GetUserContextPermissions(PermissionsGetRequestBase request)
    {
        // If global admin return all permissions.
        if (((UserContext)request.Context).Roles.Contains(Roles.GlobalAdmin))
        {
            return Permissions.AllPermissions();
        }

        return request switch
        {
            PermissionsGetRequest req => GetPermissions(req),
            OrganizationPermissionsGetRequest req => GetOrganizationPermissions(req),
            _ => throw new InvalidOperationException($"Request type '{request.GetType().Name}' is not supported.")
        };
    }

    private static string[] GetPermissions(PermissionsGetRequest request)
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

    private static string[] GetOrganizationPermissions(OrganizationPermissionsGetRequest request)
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