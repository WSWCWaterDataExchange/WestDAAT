using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class UserIntegrationTests : IntegrationTestBase
{
    private CLI.IUserManager _userManager;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = Services.GetRequiredService<CLI.IUserManager>();
    }

    [TestMethod]
    public void SmokeTest() => _userManager.Should().NotBeNull();

    [TestMethod]
    public async Task Load_EnrichJwtRequest_AsIdentityProviderContext_Success()
    {
        // Arrange
        UseIdentityProviderContext();

        // Act
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(
            new CLI.Requests.Admin.EnrichJwtRequest
            {
                ObjectId = "1234",
            });

        // Assert
        response.Should().NotBeNull();

        const string expectedAzureB2CVersion = "1.0.0";
        const string expectedAzureB2CAction = "Continue";
        response.Version.Should().Be(expectedAzureB2CVersion);
        response.Action.Should().Be(expectedAzureB2CAction);
        response.Extension_WestDaat_UserId.Should().NotBeEmpty();
        response.Extension_WestDaat_Roles.Should().Be("rol_role1,rol_role2");

        const string orgRolePrefix = "org_";
        const string rolePrefix = "rol_";
        const string orgRole1 = "organizationRole1";
        const string orgRole2 = "organizationRole2";
        response.Extension_WestDaat_OrganizationRoles.Should().ContainAll(orgRolePrefix, rolePrefix, orgRole1, orgRole2);
    }

    [DataTestMethod]
    [DataRow(typeof(AnonymousContext))]
    [DataRow(typeof(UserContext))]
    public async Task Load_EnrichJwtRequest_InvalidContext_ShouldThrow(Type contextType)
    {
        // Arrange
        ContextUtilityMock
            .Setup(mock => mock.GetContext())
            .Returns(Activator.CreateInstance(contextType) as ContextBase);

        // Act
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(
            new CLI.Requests.Admin.EnrichJwtRequest
            {
                ObjectId = "1234",
            });

        // Assert
        response.Error.Should().BeOfType<ForbiddenError>();
    }
}