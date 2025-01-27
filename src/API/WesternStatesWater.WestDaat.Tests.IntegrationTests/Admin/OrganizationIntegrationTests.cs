using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Admin;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Admin;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Admin;

[TestClass]
public class OrganizationIntegrationTests : IntegrationTestBase
{
    private CLI.IOrganizationManager _organizationManager;
    private WestDaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _organizationManager = Services.GetRequiredService<CLI.IOrganizationManager>();
        _dbContext = Services.GetRequiredService<IWestDaatDatabaseContextFactory>().Create();
    }

    [TestMethod]
    public void SmokeTest() => _organizationManager.Should().NotBeNull();

    [TestMethod]
    public async Task Load_OrganizationLoadAllRequest_GlobalAdminUser_Success()
    {
        // Arrange
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var organization = new OrganizationFaker().Generate();
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.SaveChangesAsync();

        // Act 
        var response = await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(new OrganizationLoadAllRequest() { });

        // Assert
        response.GetType().Should().Be<OrganizationLoadAllResponse>();
        response.Error.Should().BeNull();
        response.Organizations.Should().HaveCount(1);
        response.Organizations[0].Name.Should().Be(organization.Name);
        response.Organizations[0].UserCount.Should().Be(0);
        response.Organizations[0].EmailDomain.Should().Be(organization.EmailDomain);
    }

    [DataTestMethod]
    [DataRow(Roles.Member)]
    [DataRow(Roles.TechnicalReviewer)]
    [DataRow(Roles.OrganizationAdmin)]
    [DataRow("Fake role")]
    public async Task Load_OrganizationLoadAllRequest_NotGlobalAdminUser_ShouldReturnError(string role)
    {
        // Arrange
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [role],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act 
        var response = await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(new OrganizationLoadAllRequest() { });

        // Assert
        response.GetType().Should().Be<OrganizationLoadAllResponse>();
        response.Organizations.Should().BeNull();
        response.Error.Should().NotBeNull();
        response.Error!.LogMessage.Should().Contain("but did not have permission to do so.");
    }

    [TestMethod]
    public async Task Load_OrganizationLoadAllRequest_ShouldReturnAscendingOrder()
    {
        // Arrange
        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var organizations = new OrganizationFaker().Generate(3);
        var users = new UserFaker().Generate(3);
        var userOrgOne = new UserOrganizationFaker(users[0], organizations[0]).Generate();
        var userOrgTwo = new UserOrganizationFaker(users[0], organizations[1]).Generate();
        var userOrgThree = new UserOrganizationFaker(users[1], organizations[1]).Generate();

        await _dbContext.Organizations.AddRangeAsync(organizations);
        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.UserOrganizations.AddRangeAsync([userOrgOne, userOrgTwo, userOrgThree]);
        await _dbContext.SaveChangesAsync();

        // Act 
        var response = await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(new OrganizationLoadAllRequest() { });

        // Assert
        var expected = new List<CLI.OrganizationListItem>()
        {
            new CLI.OrganizationListItem()
            {
                OrganizationId = organizations[0].Id,
                Name = organizations[0].Name,
                UserCount = 1,
                EmailDomain = organizations[0].EmailDomain
            },
            new CLI.OrganizationListItem()
            {
                OrganizationId = organizations[1].Id,
                Name = organizations[1].Name,
                UserCount = 2,
                EmailDomain = organizations[1].EmailDomain
            },
            new CLI.OrganizationListItem()
            {
                OrganizationId = organizations[2].Id,
                Name = organizations[2].Name,
                UserCount = 0,
                EmailDomain = organizations[2].EmailDomain
            }
        }.OrderBy(org => org.Name);

        response.GetType().Should().Be<OrganizationLoadAllResponse>();
        response.Error.Should().BeNull();
        response.Organizations.Should().HaveCount(3);
        response.Organizations[0].Should().BeEquivalentTo(expected.ElementAt(0));
        response.Organizations[1].Should().BeEquivalentTo(expected.ElementAt(1));
        response.Organizations[2].Should().BeEquivalentTo(expected.ElementAt(2));
    }
}