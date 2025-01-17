using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common.Context;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class UserIntegrationTests : IntegrationTestBase
{
    private CLI.IUserManager _userManager;
    private Database.EntityFramework.WestDaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _userManager = Services.GetRequiredService<CLI.IUserManager>();

        var dbContextFactory = Services.GetRequiredService<Database.EntityFramework.IWestDaatDatabaseContextFactory>();
        _dbContext = dbContextFactory.Create();
    }

    [TestMethod]
    public void SmokeTest() => _userManager.Should().NotBeNull();

    [TestMethod]
    public async Task Load_EnrichJwt_ShouldReturnContinueResponseWithCorrectData()
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

        UseIdentityProviderContext();

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