using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using SendGrid.Helpers.Errors.Model;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Utilities;

public class ContextUtility(IHttpContextAccessor httpContextAccessor) : IContextUtility
{
    private const string ClaimNamespace = "extension_westdaat";

    private readonly ContextBase _context = Build(httpContextAccessor);

    private static ContextBase Build(IHttpContextAccessor httpContextAccessor)
    {
        if (httpContextAccessor.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out var authHeader))
        {
            return BuildUserContext(authHeader);
        }

        return new AnonymousContext();
    }

    public ContextBase GetContext() => _context;

    public T GetRequiredContext<T>() where T : ContextBase
    {
        if (_context is not T context)
        {
            throw new InvalidOperationException(
                $"Context is of type '{_context.GetType().Name}', not of the " +
                $"requested type '{typeof(T).Name}'."
            );
        }

        return context;
    }

    private static UserContext BuildUserContext(string authHeader)
    {
        // Example claims:
        //  {
        //   "extension_westdaat/userId": "<guid>",
        //   "extension_westdaat/organizationRoles": [
        //     "org_d3b07384-d9a7-4f3b-8a1d-6e5c3e2b7f4f/rol_Member",
        //     "org_d3b07384-d9a7-4f3b-8a1d-6e5c3e2b7f4f/rol_TechnicalReviewer",
        //     "org_e4b0f8a2-5c7d-4a8b-9e2c-7d6f3e1b8c5d/rol_OrganizationAdmin"
        //   ]
        // }

        var jwt = GetJwt(authHeader);
        var id = GetClaimValue(jwt.Claims, $"{ClaimNamespace}/userId");
        var orgRoles = GetOrganizationRoles(jwt.Claims);
        var externalAuthId = GetClaimValue(jwt.Claims, "sub");

        return new UserContext
        {
            UserId = new Guid(id),
            OrganizationRoles = orgRoles,
            ExternalAuthId = externalAuthId,
        };
    }

    private static JwtSecurityToken GetJwt(string authHeaderValue)
    {
        if (authHeaderValue is null)
        {
            throw new InvalidOperationException("Authorization header was not found.");
        }

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

    private static OrganizationRole[] GetOrganizationRoles(IEnumerable<Claim> claims)
    {
        var claimValues = claims
            .Where(claim => claim.Type == $"{ClaimNamespace}/organizationRoles")
            .Select(claim => claim.Value.Split("/"))
            .ToArray();

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
}