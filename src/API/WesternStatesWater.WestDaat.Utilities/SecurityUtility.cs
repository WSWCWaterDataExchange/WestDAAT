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
            or.OrganizationId == request.OrganizationId
        );

        if (organizationRoles is null)
        {
            throw new InvalidOperationException($"User does not have roles for organization '{request.OrganizationId}'.");
        }

        var uniquePermissions = new HashSet<string>();
        foreach (var role in userContext.Roles)
        {
            if (RolePermissions.TryGetValue(role, out var permissions))
            {
                uniquePermissions.UnionWith(permissions);
            }
        }

        foreach (var role in organizationRoles.RoleNames)
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
                Permissions.UserLoad
            ]
        },
        {
            Roles.TechnicalReviewer,
            [
                Permissions.UserLoad
            ]
        },
        {
            Roles.OrganizationAdmin,
            [
                Permissions.UserLoad
            ]
        },
        {
            Roles.GlobalAdmin,
            Permissions.AllPermissions()
        }
    };
}