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
        var userRoles = new UserRoleFaker()
            .RuleFor(ur => ur.User, () => user)
            .Generate(2);
        var userOrganization = new UserOrganizationFaker()
            .RuleFor(uo => uo.User, () => user)
            .RuleFor(uo => uo.Organization, () => organization)
            .Generate();
        var userOrganizationRoles = new UserOrganizationRoleFaker()
            .RuleFor(uor => uor.UserOrganization, () => userOrganization)
            .Generate(2);

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserRoles.AddRangeAsync(userRoles);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
        await _dbContext.UserOrganizationRoles.AddRangeAsync(userOrganizationRoles);

        await _dbContext.SaveChangesAsync();
        _dbContext.ChangeTracker.Clear();

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = user.ExternalAuthId,
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