using Microsoft.EntityFrameworkCore;
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
    public async Task Load_OrganizationListDetailsRequest_GlobalAdminUser_ShouldReturnAscendingOrder()
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
        var response = await _organizationManager.Load<OrganizationListDetailsRequest, OrganizationListDetailsResponse>(new OrganizationListDetailsRequest() { });

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

        response.GetType().Should().Be<OrganizationListDetailsResponse>();
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
    public async Task Load_OrganizationListDetailsRequest_NotGlobalAdminUser_ShouldReturnError(string role)
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
        var response = await _organizationManager.Load<OrganizationListDetailsRequest, OrganizationListDetailsResponse>(new OrganizationListDetailsRequest() { });

        // Assert
        response.GetType().Should().Be<OrganizationListDetailsResponse>();
        response.Organizations.Should().BeNull();
        response.Error.Should().NotBeNull();
        response.Error!.LogMessage.Should().Contain("but did not have permission to do so.");
    }


    [TestMethod]
    public async Task Load_OrganizationListSummaryRequest_ShouldReturnAscendingOrder()
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
        await _dbContext.Organizations.AddRangeAsync(organizations);
        await _dbContext.SaveChangesAsync();

        // Act 
        var response = await _organizationManager.Load<OrganizationListSummaryRequest, OrganizationListSummaryResponse>(new OrganizationListSummaryRequest());

        // Assert
        var expected = new List<CLI.OrganizationSummaryItem>
        {
            new()
            {
                OrganizationId = organizations[0].Id,
                Name = organizations[0].Name
            },
            new()
            {
                OrganizationId = organizations[1].Id,
                Name = organizations[1].Name
            },
            new()
            {
                OrganizationId = organizations[2].Id,
                Name = organizations[2].Name
            }
        }.OrderBy(org => org.Name);

        response.GetType().Should().Be<OrganizationListSummaryResponse>();
        response.Error.Should().BeNull();
        response.Organizations.Should().HaveCount(3);
        response.Organizations[0].Should().BeEquivalentTo(expected.ElementAt(0));
        response.Organizations[1].Should().BeEquivalentTo(expected.ElementAt(1));
        response.Organizations[2].Should().BeEquivalentTo(expected.ElementAt(2));
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
            response.Error.Should().BeNull();
            var insertedUserOrg = await _dbContext.UserOrganizations.Include(uo => uo.UserOrganizationRoles)
                .FirstOrDefaultAsync(uo =>
                    uo.UserId == userToBeAdded.Id &&
                    uo.OrganizationId == organization.Id
                );
            insertedUserOrg.Should().NotBeNull();
            insertedUserOrg!.UserOrganizationRoles.Should().HaveCount(1);
            insertedUserOrg.UserOrganizationRoles.First().Role.Should().Be(Roles.Member);
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ForbiddenError>();
            response.Error!.LogMessage.Should().Contain("but did not have permission to do so.");
        }
    }

    [DataTestMethod]
    [DataRow(Roles.Member, true, DisplayName = "Should be able to assign a user memeber role")]
    [DataRow(Roles.TechnicalReviewer, true, DisplayName = "Should be able to assign a user technical reviewer role")]
    [DataRow(Roles.OrganizationAdmin, true, DisplayName = "Should be able to assign a user organization admin role")]
    [DataRow(Roles.GlobalAdmin, false, DisplayName = "Should not be able to assign a user global admin role")]
    public async Task Store_OrganizationMemberAddRequest_ShouldNotAllowPrivilegedRoles(string role, bool isAllowed)
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
            // Even global admin cannot make another global admin.
            // This is only possible via the database.
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
        });

        // Act
        var response = await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(new OrganizationMemberAddRequest()
        {
            OrganizationId = organization.Id,
            UserId = userToBeAdded.Id,
            Role = role
        });

        // Assert
        if (isAllowed)
        {
            response.Error.Should().BeNull();
            var insertedUserOrg = await _dbContext.UserOrganizations.Include(uo => uo.UserOrganizationRoles)
                .FirstOrDefaultAsync(uo =>
                    uo.UserId == userToBeAdded.Id &&
                    uo.OrganizationId == organization.Id
                );
            insertedUserOrg.Should().NotBeNull();
            insertedUserOrg!.UserOrganizationRoles.Should().HaveCount(1);
            insertedUserOrg.UserOrganizationRoles.First().Role.Should().Be(role);
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ValidationError>();
        }
    }


    [TestMethod]
    public async Task Store_OrganizationMemberAddRequest_ShouldNotAllowAddingSelf()
    {
        // Arrange
        var organization = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();
        var userOrg = new UserOrganizationFaker(user, organization).Generate();

        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Users.AddAsync(user);
        await _dbContext.UserOrganizations.AddAsync(userOrg);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
        });

        // Act
        var response = await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(new OrganizationMemberAddRequest()
        {
            OrganizationId = organization.Id,
            UserId = user.Id,
            Role = Roles.Member
        });

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ForbiddenError>();
    }

    [TestMethod]
    public async Task Store_OrganizationMemberAddRequest_AddingMemeberToSecondOrganization_ShouldNotAllow()
    {
        // Arrange
        var organizationOne = new OrganizationFaker().Generate();
        var organizationTwo = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();
        var userToBeAdded = new UserFaker().Generate();
        var userOrgTwo = new UserOrganizationFaker(userToBeAdded, organizationTwo).Generate();

        await _dbContext.Organizations.AddRangeAsync(organizationOne, organizationTwo);
        await _dbContext.Users.AddRangeAsync(user, userToBeAdded);
        await _dbContext.UserOrganizations.AddRangeAsync(userOrgTwo);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = []
        });

        // Act
        var response = await _organizationManager.Store<OrganizationMemberAddRequest, OrganizationMemberAddResponse>(new OrganizationMemberAddRequest()
        {
            OrganizationId = organizationOne.Id,
            UserId = userToBeAdded.Id,
            Role = Roles.Member
        });

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ConflictError>();
    }
}