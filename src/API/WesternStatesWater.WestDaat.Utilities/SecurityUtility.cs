using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

internal class SecurityUtility : ISecurityUtility
{
    public string[] GetPermissions(ContextBase context, Guid organizationId)
    {
        return context switch
        {
            UserContext userContext => GetPermissions(userContext, organizationId),
            AnonymousContext => [],
            _ => throw new NotImplementedException($"Permissions for context type '{context.GetType().Name}' are not implemented.")
        };
    }

    private static string[] GetPermissions(UserContext context, Guid organizationId)
    {
        var organizationRoles = context.OrganizationRoles.FirstOrDefault(or => or.OrganizationId == organizationId);
        if (organizationRoles is null)
        {
            throw new InvalidOperationException($"User does not have roles for organization '{organizationId}'.");
        }

        var uniquePermissions = new HashSet<string>();
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
        }
        // GlobalAdmin has all permissions.
    };
}