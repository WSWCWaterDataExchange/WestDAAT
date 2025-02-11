using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
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
    public async Task Load_OrganizationLoadAllRequest_GlobalAdminUser_ShouldReturnAscendingOrder()
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

    [DataTestMethod]
    [DataRow(true, Roles.Member, false, DisplayName = "Member should not be allowed to add members")]
    [DataRow(true, Roles.TechnicalReviewer, false, DisplayName = "Technical reviewer should not be allowed to add members")]
    [DataRow(true, Roles.OrganizationAdmin, true, DisplayName = "Organization admin should be allowed to add members")]
    [DataRow(false, Roles.GlobalAdmin, true, DisplayName = "Global admin should be allowed to add members")]
    public async Task Store_OrganizationMemberAddRequest_ShouldThrowIfUserHasInsufficientPermissions(bool isOrgRole, string role, bool isAllowed)
    {
        // Arrange
        var organization = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();
        var userToBeAdded = new UserFaker().Generate();
        var userOrg = new UserOrganizationFaker(user, organization).Generate();

        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Users.AddRangeAsync(user, userToBeAdded);
        await _dbContext.UserOrganizations.AddAsync(userOrg);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = !isOrgRole ? [role] : [],
            OrganizationRoles = isOrgRole
                ?
                [
                    new OrganizationRole
                    {
                        OrganizationId = organization.Id,
                        RoleNames = [role]
                    }
                ]
                : [],
            ExternalAuthId = ""
        });

        // Act
        var response = await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(new OrganizationMemberAddRequest()
        {
            OrganizationId = organization.Id,
            UserId = userToBeAdded.Id,
            Role = Roles.Member
        });

        // Assert
        if (isAllowed)
        {
            response.Error.Should().BeOfType<InternalError>(); // Due to temp NotImplementedException
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ForbiddenError>();
            response.Error!.LogMessage.Should().Contain("but did not have permission to do so.");
        }
    }

    // TODO test that you can't assign someone to global admin

    // TODO test that you can't add yourself

    // TODO test that you can't add a user to an organization twice
}