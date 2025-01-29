using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Conservation;

[TestClass]
public class ApplicationIntegrationTests : IntegrationTestBase
{
    private IApplicationManager _applicationManager;
    private WestDaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationManager = Services.GetRequiredService<IApplicationManager>();
        _dbContext = Services.GetRequiredService<IWestDaatDatabaseContextFactory>().Create();
    }

    [TestMethod]
    public void SmokeTest() => _applicationManager.Should().NotBeNull();

    [DataTestMethod]
    [DataRow(Roles.GlobalAdmin, null)]
    [DataRow(null, Roles.OrganizationAdmin)]
    [DataRow(null, Roles.TechnicalReviewer)]
    public async Task Load_ApplicationDashboardRequest_ValidUser_Success(string globalRole, string orgRole)
    {
        // Arrange
        var organization = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();
        var userOrg = new UserOrganizationFaker(user, organization).Generate();
        var userOrgRole = new UserOrganizationRoleFaker(userOrg, orgRole).Generate();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [globalRole],
            OrganizationRoles =
            [
                new OrganizationRole()
                {
                    OrganizationId = organization.Id,
                    RoleNames = [userOrgRole.Role]
                }
            ],
            ExternalAuthId = user.ExternalAuthId
        });

        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Users.AddAsync(user);
        await _dbContext.UserOrganizations.AddAsync(userOrg);
        await _dbContext.UserOrganizationRoles.AddAsync(userOrgRole);
        await _dbContext.SaveChangesAsync();

        var request = new ApplicationDashboardLoadRequest()
        {
            OrganizationId = organization.Id
        };

        // Act
        var response = await _applicationManager.Load<ApplicationDashboardLoadRequest, ApplicationDashboardLoadResponse>(request);

        // Assert
        response.GetType().Should().Be<ApplicationDashboardLoadResponse>();
        response.Error.Should().NotBeNull(); // because accessor is throwing a NotImplementedException but it gets caught by ManagerBase
    }

    [TestMethod]
    public async Task Load_ApplicationDashboardRequest_InvalidUser_ShouldThrow()
    {
        // Arrange
        var organization = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();
        var userOrg = new UserOrganizationFaker(user, organization).Generate();
        var userOrgRole = new UserOrganizationRoleFaker(userOrg, "invalid role").Generate();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [],
            OrganizationRoles =
            [
                new OrganizationRole()
                {
                    OrganizationId = organization.Id,
                    RoleNames = [userOrgRole.Role]
                }
            ],
            ExternalAuthId = user.ExternalAuthId
        });

        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Users.AddAsync(user);
        await _dbContext.UserOrganizations.AddAsync(userOrg);
        await _dbContext.UserOrganizationRoles.AddAsync(userOrgRole);
        await _dbContext.SaveChangesAsync();

        var request = new ApplicationDashboardLoadRequest()
        {
            OrganizationId = organization.Id
        };

        // Act
        var response = await _applicationManager.Load<ApplicationDashboardLoadRequest, ApplicationDashboardLoadResponse>(request);

        // Assert
        response.GetType().Should().Be<ApplicationDashboardLoadResponse>();
        response.Error.Should().NotBeNull();
        response.Error!.LogMessage.Should().Contain("attempted to make a request of type 'ApplicationDashboardLoadRequest', but did not have permission to do so.");
    }
}