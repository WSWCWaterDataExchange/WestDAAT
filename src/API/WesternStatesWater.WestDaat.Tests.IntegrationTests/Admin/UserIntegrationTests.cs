using Microsoft.Extensions.DependencyInjection;

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
    public async Task GetUserRoles_Success()
    {
        // Arrange
        var userExternalAuthId = "1234";

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = userExternalAuthId,
        };
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(request);

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
}