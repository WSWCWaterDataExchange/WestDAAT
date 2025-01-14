using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class UserIntegrationTests : IntegrationTestBase
{
    private CLI.IUserManager _userManager;
    private Database.EntityFramework.WestdaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = Services.GetRequiredService<CLI.IUserManager>();

        var dbContextFactory = Services.GetRequiredService<Database.EntityFramework.IWestdaatDatabaseContextFactory>();
        _dbContext = dbContextFactory.Create();
    }
    
    [TestMethod]
    public void SmokeTest() => _userManager.Should().NotBeNull();

    [TestMethod]
    public async Task GetUserRoles_Success()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var userRoles = new UserRoleFaker(user).Generate(2);
        var userOrganization = new UserOrganizationFaker(user, organization).Generate();
        var userOrganizationRoles = new UserOrganizationRoleFaker(userOrganization).Generate(2);

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserRoles.AddRangeAsync(userRoles);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
        await _dbContext.UserOrganizationRoles.AddRangeAsync(userOrganizationRoles);

        await _dbContext.SaveChangesAsync();

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = user.ExternalAuthId,
        };
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(request);

        // Assert
        response.Should().NotBeNull();

        // metadata
        const string expectedAzureB2CVersion = "1.0.0";
        const string expectedAzureB2CAction = "Continue";
        response.Version.Should().Be(expectedAzureB2CVersion);
        response.Action.Should().Be(expectedAzureB2CAction);

        // actual data
        response.Extension_WestDaat_UserId.Should().Be(user.Id.ToString());
        userRoles.All(ur => response.Extension_WestDaat_Roles.Contains($"rol_{ur.Role}")).Should().BeTrue();

        userOrganizationRoles.All(uor => response.Extension_WestDaat_OrganizationRoles
            .Contains($"org_{uor.UserOrganization.OrganizationId}/rol_{uor.Role}")
        ).Should().BeTrue();
    }
}