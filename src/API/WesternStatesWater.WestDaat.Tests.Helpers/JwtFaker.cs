using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace WesternStatesWater.WestDaat.Tests.Helpers;

public static class JwtFaker
{
    public static string Generate(
        Guid userId,
        Guid externalAuthId,
        List<KeyValuePair<Guid, string>> orgRoles = null,
        string[] roles = null)
    {
        var claims = new List<Claim>
        {
            new("extension_westdaat_userId", userId.ToString()),
            new("sub", externalAuthId.ToString())
        };

        if (orgRoles is not null)
        {
            claims.Add(
                new Claim(
                    "extension_westdaat_organizationRoles",
                    string.Join(',', orgRoles.Select(orgId =>$"org_{orgId.Key}/rol_{orgId.Value}"))
                )
            );
        }

        if (roles is not null)
        {
            claims.Add(
                new Claim(
                    "extension_westdaat_roles",
                    string.Join(',', roles.Select(role => $"rol_{role}"))
                )
            );
        }

        var jwt = new JwtSecurityToken(
            "issuer",
            "audience",
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow.AddDays(1),
            new SigningCredentials(
                new SymmetricSecurityKey("..keep_it_secret___keep_it_safe.."u8.ToArray()),
                SecurityAlgorithms.HmacSha256));

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);

        return token;
    }
}