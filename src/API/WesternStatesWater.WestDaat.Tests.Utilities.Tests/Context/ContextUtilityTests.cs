using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using SendGrid.Helpers.Errors.Model;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests.Context;

[TestClass]
public class ContextUtilityTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();

    private readonly IdentityProviderConfiguration _identityProviderConfigurationMock = new()
    {
        ApiConnectorUsername = "tmctesterson",
        ApiConnectorPassword = "secretpassword"
    };

    [TestMethod]
    public void BuildContext_AnonymousContext_ShouldSetContext()
    {
        StringValues headerValue = default;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(false);

        var utility = new ContextUtility(_httpContextAccessorMock.Object, _identityProviderConfigurationMock);

        utility.GetContext().Should().BeOfType<AnonymousContext>();
    }

    [TestMethod]
    public void BuildContext_IdentityProviderContext_ShouldSetContext()
    {
        StringValues headerValue = "Basic dG1jdGVzdGVyc29uOnNlY3JldHBhc3N3b3Jk";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        utility.GetContext().Should().BeOfType<IdentityProviderContext>();
    }

    [DataTestMethod]
    [DataRow("Basic username_only")]
    [DataRow("Basic too:many:parts")]
    [DataRow("Basic ")]
    public void BuildContext_IdentityProviderContext_InvalidFormat_ShouldThrow(string basicValue)
    {
        var base64Value = Convert.ToBase64String(Encoding.UTF8.GetBytes(basicValue));
        StringValues headerValue = $"Basic {base64Value}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        Action action = () => utility.GetContext();

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("Basic auth header is not in a valid format.");
    }
    
    [DataTestMethod]
    [DataRow("Basic mctesterson:wrongpassword")]
    [DataRow("Basic wrongusername:supersecretpassword")]
    public void BuildContext_IdentityProviderContext_InvalidCredentials_ShouldThrow(string basicValue)
    {
        var base64Value = Convert.ToBase64String(Encoding.UTF8.GetBytes(basicValue));
        StringValues headerValue = $"Basic {base64Value}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        Action action = () => utility.GetContext();

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("Invalid username or password.");
    }

    [TestMethod]
    public void BuildContext_UserContext_ShouldSetContext()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var externalAuthId = Guid.NewGuid();

        var org1 = Guid.NewGuid();
        var org2 = Guid.NewGuid();

        var orgRoles = new List<KeyValuePair<Guid, string>>
        {
            new(org1, "Member"),
            new(org2, "TechnicalReviewer"),
            new(org2, "OrganizationAdmin")
        };

        var jwt = JwtFaker.Generate(userId, externalAuthId, orgRoles);
        StringValues headerValue = $"Bearer {jwt}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        // Act
        var context = utility.GetContext();

        // Assert
        context.Should().BeOfType<UserContext>();
        var userContext = (UserContext)context;
        userContext.UserId.Should().Be(userId);
        userContext.ExternalAuthId.Should().Be(externalAuthId.ToString());
        userContext.OrganizationRoles.Length.Should().Be(2);

        var orgRole1 = userContext.OrganizationRoles.Single(x => x.OrganizationId == org1);
        orgRole1.RoleNames.Single().Should().Be("Member");

        var orgRole2 = userContext.OrganizationRoles.Single(x => x.OrganizationId == org2);
        orgRole2.RoleNames.Length.Should().Be(2);
        orgRole2.RoleNames.Should().Contain("OrganizationAdmin");
        orgRole2.RoleNames.Should().Contain("TechnicalReviewer");
    }

    [TestMethod]
    public void BuildContext_UserContext_NoOrganizations_ShouldHaveNoOrganizationRoles()
    {
        // Arrange
        var jwt = JwtFaker.Generate(Guid.NewGuid(), Guid.NewGuid());
        StringValues headerValue = $"Bearer {jwt}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        // Act
        var context = utility.GetContext();

        // Assert
        context.Should().BeOfType<UserContext>();
        var userContext = (UserContext)context;
        userContext.OrganizationRoles.Length.Should().Be(0);
    }

    [TestMethod]
    public void BuildContext_UserContext_InvalidJwt_ShouldThrow()
    {
        // Arrange
        StringValues headerValue = "Bearer not_a_token";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        // Act
        var action = () => utility.GetContext();

        // Assert
        action.Should().Throw<InvalidOperationException>()
            .WithMessage("Authorization header did not contain a valid JWT.");
    }

    [TestMethod]
    public void BuildContext_UserContext_MalformedRoleClaim_ShouldThrow()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var externalAuthId = Guid.NewGuid();

        var orgRoles = new List<KeyValuePair<Guid, string>>
        {
            new(Guid.NewGuid(), "invalid/claim/format/should/throw"),
        };

        var jwt = JwtFaker.Generate(userId, externalAuthId, orgRoles);
        StringValues headerValue = $"Bearer {jwt}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        // Act
        Action action = () => utility.GetContext();

        // Assert
        action.Should().Throw<UnauthorizedException>()
            .WithMessage("Organization roles were improperly formatted.");
    }

    [TestMethod]
    public void BuildContext_UserContext_GlobalAdminRole_ShouldSetContext()
    {
        // Arrange
        var roles = new[] { "GlobalAdmin" };
        var orgRoles = new List<KeyValuePair<Guid, string>> { };

        var jwt = JwtFaker.Generate(Guid.NewGuid(), Guid.NewGuid(), orgRoles, roles);
        StringValues headerValue = $"Bearer {jwt}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        // Act
        var context = utility.GetContext();

        // Assert
        context.Should().BeOfType<UserContext>();
        var userContext = (UserContext)context;

        userContext.Roles.Length.Should().Be(1);
        userContext.Roles.Single().Should().Be("GlobalAdmin");
    }

    [TestMethod]
    public void GetRequiredContext_ContextMatchesRequestedType_ShouldReturnContext()
    {
        var jwt = JwtFaker.Generate(Guid.NewGuid(), Guid.NewGuid());
        StringValues headerValue = $"Bearer {jwt}";

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(true);

        var utility = BuildContextUtility();

        utility.GetRequiredContext<UserContext>().Should().BeOfType<UserContext>();
    }

    [TestMethod]
    public void GetRequiredContext_ContextDoesNotMatchRequestedType_ShouldThrow()
    {
        StringValues headerValue = default;

        _httpContextAccessorMock
            .Setup(x => x.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out headerValue))
            .Returns(false);

        var utility = BuildContextUtility();

        // Act
        Action action = () => utility.GetRequiredContext<UserContext>();

        action.Should().Throw<InvalidOperationException>()
            .WithMessage("Context is of type 'AnonymousContext', not of the requested type 'UserContext'.");
    }

    private ContextUtility BuildContextUtility()
    {
        return new ContextUtility(_httpContextAccessorMock.Object, _identityProviderConfigurationMock);
    }
}