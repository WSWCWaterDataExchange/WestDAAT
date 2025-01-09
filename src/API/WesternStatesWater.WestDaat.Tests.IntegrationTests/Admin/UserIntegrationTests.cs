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

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = "1234",
        };
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(request);

        // Assert
        response.Should().NotBeNull();

        const string expectedAzureB2CVersion = "1.0.0";
        const string expectedAzureB2CAction = "Continue";
        response.Version.Should().Be(expectedAzureB2CVersion);
        response.Action.Should().Be(expectedAzureB2CAction);
        response.Extension_WestDaat_Roles.Should().BeEquivalentTo("role1,role2");
    }
}