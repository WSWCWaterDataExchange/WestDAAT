using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using SendGrid.Helpers.Errors.Model;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public class ContextUtility(IHttpContextAccessor httpContextAccessor, IdentityProviderConfiguration identityProviderConfiguration) : IContextUtility
{
    private const string ClaimNamespace = "extension_westdaat";

    private readonly ContextBase _context = null;

    private ContextBase Build()
    {
        if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out var authHeader))
        {
            string authHeaderString = authHeader;

            if (authHeaderString.StartsWith("Bearer"))
            {
                return BuildUserContext(authHeaderString);
            }

            if (authHeaderString.StartsWith("Basic"))
            {
                return BuildIdentityProviderContext(authHeaderString);
            }
        }

        return new AnonymousContext();
    }

    public ContextBase GetContext() => _context ?? Build();

    public T GetRequiredContext<T>() where T : ContextBase
    {
        if (GetContext() is not T context)
        {
            throw new InvalidOperationException(
                $"Context is of type '{GetContext().GetType().Name}', not of the " +
                $"requested type '{typeof(T).Name}'."
            );
        }

        return context;
    }

    private static UserContext BuildUserContext(string authHeader)
    {
        // Example jwt claims:
        // Note - azure b2c requires the namespace to be prefixed with "extension_"
        //  {
        //   "extension_westdaat_userId": "<guid>",
        //   "extension_westdaat_roles": "rol_<role name>,rol_<role name>" // csv string
        //   "extension_westdaat_organizationRoles": "org_<org-guid>/rol_<role name>,org_<org-guid>/rol_<role name>" // csv string
        // }

        var jwt = GetJwt(authHeader);
        var id = GetClaimValue(jwt.Claims, $"{ClaimNamespace}_userId");
        var roles = GetRoles(jwt.Claims);
        var orgRoles = GetOrganizationRoles(jwt.Claims);
        var externalAuthId = GetClaimValue(jwt.Claims, "sub");

        return new UserContext
        {
            UserId = new Guid(id),
            Roles = roles,
            OrganizationRoles = orgRoles,
            ExternalAuthId = externalAuthId,
        };
    }

    private static JwtSecurityToken GetJwt(string authHeaderValue)
    {
        var bearerToken = authHeaderValue.Replace("Bearer ", string.Empty);
        var tokenHandler = new JwtSecurityTokenHandler();

        if (tokenHandler.CanReadToken(bearerToken))
        {
            return tokenHandler.ReadJwtToken(bearerToken);
        }

        throw new InvalidOperationException("Authorization header did not contain a valid JWT.");
    }

    private static string GetClaimValue(IEnumerable<Claim> claims, string type)
    {
        var claimValue = claims
            .FirstOrDefault(claim => claim.Type == type)
            ?.Value;

        return !string.IsNullOrWhiteSpace(claimValue)
            ? claimValue
            : throw new InvalidOperationException($"'{type}' was not found on JWT.");
    }

    private static string[] GetRoles(IEnumerable<Claim> claims)
    {
        var rolesClaim = claims.FirstOrDefault(claim => claim.Type == $"{ClaimNamespace}_roles");

        if (string.IsNullOrEmpty(rolesClaim?.Value))
        {
            return [];
        }

        // value is a csv string
        var roles = rolesClaim.Value.Split(",")
            .Select(role => role.Replace("rol_", ""))
            .ToArray();

        return roles;
    }

    private static OrganizationRole[] GetOrganizationRoles(IEnumerable<Claim> claims)
    {
        var orgRolesClaim = claims.FirstOrDefault(claim => claim.Type == $"{ClaimNamespace}_organizationRoles");

        if (string.IsNullOrEmpty(orgRolesClaim?.Value))
        {
            return [];
        }

        // value is csv string
        var orgRoleStrings = orgRolesClaim.Value.Split(",");

        var claimValues = orgRoleStrings.Select(orgRoleString => orgRoleString.Split("/")).ToArray();

        if (claimValues.Any(claimValue => claimValue.Length != 2))
        {
            throw new UnauthorizedException("Organization roles were improperly formatted.");
        }

        var flatOrgRoles = claimValues
            .Select(claimValue => new
            {
                OrganizationId = new Guid(claimValue[0].Replace("org_", "")),
                RoleName = claimValue[1].Replace("rol_", "")
            }).ToArray();

        // Group the organization roles together
        var orgRoles = flatOrgRoles
            .GroupBy(orgRole => orgRole.OrganizationId)
            .Select(group => new OrganizationRole
                {
                    OrganizationId = group.Key,
                    RoleNames = group.Select(orgRole => orgRole.RoleName).ToArray()
                }
            ).ToArray();

        return orgRoles;
    }

    private IdentityProviderContext BuildIdentityProviderContext(string authHeader)
    {
        var (username, password) = ParseBasicAuthHeader(authHeader);

        ValidateIdentityProviderCredentials(username, password);

        return new IdentityProviderContext();
    }

    private (string Username, string Password) ParseBasicAuthHeader(string authHeader)
    {
        var basicAuth = authHeader.Replace("Basic ", string.Empty);
        var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(basicAuth));
        var parts = decoded.Split(":");

        if (parts.Length != 2)
        {
            throw new InvalidOperationException("Basic auth header is not in a valid format.");
        }

        return (parts[0], parts[1]);
    }

    private void ValidateIdentityProviderCredentials(string username, string password)
    {
        if (username != identityProviderConfiguration.ApiConnectorUsername ||
            password != identityProviderConfiguration.ApiConnectorPassword)
        {
            throw new InvalidOperationException("Invalid username or password.");
        }
    }
}