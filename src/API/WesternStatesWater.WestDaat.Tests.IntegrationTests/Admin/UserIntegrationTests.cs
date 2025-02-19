using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common.Context;
using System.Data.Entity;
using WesternStatesWater.WestDaat.Common;

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
    public async Task Load_EnrichJwtRequest_AsIdentityProviderContext_Success()
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
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(
            new CLI.Requests.Admin.EnrichJwtRequest
            {
                ObjectId = user.ExternalAuthId,
                Email = user.Email
            });

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
    public async Task Load_EnrichJwtRequest_AsIdentityProviderContext_ShouldCreateUserIfDoesNotExist()
    {
        // Arrange
        UseIdentityProviderContext();

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = "1234",
            Email = "email@website"
        };
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(request);

        // Assert
        response.Should().NotBeNull();

        response.Extension_WestDaat_UserId.Should().NotBeEmpty();
        response.Extension_WestDaat_Roles.Should().BeEmpty();
        response.Extension_WestDaat_OrganizationRoles.Should().BeEmpty();

        var dbUser = _dbContext.Users.Single(u => u.ExternalAuthId == request.ObjectId);
        dbUser.Email.Should().Be(request.Email);
        dbUser.CreatedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromMinutes(1));
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
                Email = "email@website"
            });

        // Assert
        response.Error.Should().BeOfType<ForbiddenError>();
    }


    [DataTestMethod]
    [DataRow(Roles.GlobalAdmin, true)]
    [DataRow(Roles.OrganizationAdmin, true)]
    [DataRow(Roles.Member, false)]
    [DataRow(Roles.TechnicalReviewer, false)]
    public async Task Load_UserSearchRequest_InvalidRole_ShouldThrow(string role, bool isAllowed)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var userOrgnization = new UserOrganizationFaker(user, organization).Generate();
        var userRoles = new UserRoleFaker(user).Generate(1);
        userRoles[0].Role = role;

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrgnization);
        await _dbContext.UserRoles.AddRangeAsync(userRoles);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = user.Id,
                Roles = role == Roles.GlobalAdmin ? [role] : [],
                OrganizationRoles = role != Roles.GlobalAdmin
                    ?
                    [
                        new OrganizationRole
                        {
                            OrganizationId = userOrgnization.OrganizationId,
                            RoleNames = [role]
                        }
                    ]
                    : []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserSearchRequest, CLI.Responses.Admin.UserSearchResponse>(
            new CLI.Requests.Admin.UserSearchRequest
            {
                SearchTerm = user.UserProfile.FirstName
            });

        // Assert
        if (isAllowed)
        {
            result.Error.Should().BeNull();
            result.SearchResults.Should().HaveCount(1);
            result.SearchResults.First().UserId.Should().Be(user.Id);
            result.SearchResults.First().FirstName.Should().Be(user.UserProfile.FirstName);
            result.SearchResults.First().LastName.Should().Be(user.UserProfile.LastName);
            result.SearchResults.First().UserName.Should().Be(user.UserProfile.UserName);
        }
        else
        {
            result.Error.Should().BeOfType<ForbiddenError>();
        }
    }

    [DataTestMethod]
    [DataRow(null, false, DisplayName = "Null SearchTerm")]
    [DataRow("", false, DisplayName = "Empty SearchTerm")]
    [DataRow("a", false, DisplayName = "001 character SearchTerm")]
    [DataRow("ab", false, DisplayName = "002 character SearchTerm")]
    [DataRow("abc", true, DisplayName = "003 character SearchTerm")]
    [DataRow("100+ characters test test test test test test test test test test test test test test test test test test", false, DisplayName = "100+ character SearchTerm")]
    public async Task Load_UserSearchRequest_InvalidSearchTerm_ShouldThrow(string searchTerm, bool isValid)
    {
        // Arrange
        UseUserContext(
            new UserContext
            {
                UserId = Guid.NewGuid(),
                Roles = [Roles.GlobalAdmin],
                OrganizationRoles = []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserSearchRequest, CLI.Responses.Admin.UserSearchResponse>(
            new CLI.Requests.Admin.UserSearchRequest
            {
                SearchTerm = searchTerm
            });

        // Assert
        if (isValid)
        {
            result.Error.Should().BeNull();
        }
        else
        {
            result.Error.Should().BeOfType<ValidationError>();
        }
    }

    [DataTestMethod]
    [DataRow("FirstName", 3, DisplayName = "Exact match - by FirstName")]
    [DataRow("LastName", 3, DisplayName = "Exact match - by LastName")]
    [DataRow("UserName", 3, DisplayName = "Exact match - by UserName")]
    [DataRow("FirstName LastName", 3, DisplayName = "Exact match - by FirstName LastName")]
    [DataRow("First", 3, DisplayName = "Partial match - by FirstName")]
    [DataRow("Last", 3, DisplayName = "Partial match - by LastName")]
    [DataRow("User", 3, DisplayName = "Partial match - by UserName")]
    [DataRow("FirstName Last", 3, DisplayName = "Partial match - by FirstName LastName")]
    [DataRow("name", 3, DisplayName = "Partial match - by FirstName, LastName, UserName")]
    [DataRow("First ", 3, DisplayName = "Trimmed partial match - FirstName (trailing space)")]
    [DataRow(" First", 3, DisplayName = "Trimmed partial match - FirstName (leading space)")]
    [DataRow("No Match", 0, DisplayName = "No match")]
    public async Task Load_UserSearchRequest_Success(string searchTerm, int resultCount)
    {
        // Arrange
        var users = new UserFaker()
            .RuleFor(u => u.UserProfile, _ => new UserProfileFaker()
                .RuleFor(up => up.FirstName, _ => "FirstName")
                .RuleFor(up => up.LastName, _ => "LastName")
                .RuleFor(up => up.UserName, f => "UserName" + f.Random.String(24))
                .Generate())
            .Generate(3);

        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = Guid.NewGuid(),
                Roles = [Roles.GlobalAdmin],
                OrganizationRoles = []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserSearchRequest, CLI.Responses.Admin.UserSearchResponse>(
            new CLI.Requests.Admin.UserSearchRequest
            {
                SearchTerm = searchTerm
            });

        // Assert
        result.Error.Should().BeNull();
        result.SearchResults.Should().HaveCount(resultCount);
    }

    [DataTestMethod]
    [DataRow(Roles.GlobalAdmin, true)]
    [DataRow(Roles.OrganizationAdmin, false)]
    [DataRow(Roles.Member, false)]
    [DataRow(Roles.TechnicalReviewer, false)]
    public async Task Load_UserListRequest_ShouldThrowIfInsufficientPermissions(string role, bool isAllowed)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var userOrgnization = new UserOrganizationFaker(user, organization).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrgnization);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = user.Id,
                Roles = role == Roles.GlobalAdmin ? [role] : [],
                OrganizationRoles = role != Roles.GlobalAdmin
                    ?
                    [
                        new OrganizationRole
                        {
                            OrganizationId = userOrgnization.OrganizationId,
                            RoleNames = [role]
                        }
                    ]
                    : []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserListRequest, CLI.Responses.Admin.UserListResponse>(
            new CLI.Requests.Admin.UserListRequest()
        );

        // Assert
        if (isAllowed)
        {
            result.Error.Should().BeNull();
            result.Users.Should().NotBeEmpty();
        }
        else
        {
            result.Error.Should().BeOfType<ForbiddenError>();
        }
    }

    [DataTestMethod]
    [DataRow(Roles.GlobalAdmin, true)]
    [DataRow(Roles.OrganizationAdmin, true)]
    [DataRow(Roles.Member, false)]
    [DataRow(Roles.TechnicalReviewer, false)]
    public async Task Load_OrganizationUserListRequest_ShouldThrowIfInsufficientPermissions(string role, bool isAllowed)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var unrelatedOrganization = new OrganizationFaker().Generate();
        var userOrgnization = new UserOrganizationFaker(user, organization).Generate();
        var unrelatedUserOrgnization = new UserOrganizationFaker(user, unrelatedOrganization).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Organizations.AddAsync(unrelatedOrganization);
        await _dbContext.UserOrganizations.AddAsync(userOrgnization);
        await _dbContext.UserOrganizations.AddAsync(unrelatedUserOrgnization);
        await _dbContext.SaveChangesAsync();

        // This unrelated org should not affect permissions
        var unrelatedOrgAdminRole = new OrganizationRole
        {
            OrganizationId = unrelatedOrganization.Id,
            RoleNames = [Roles.OrganizationAdmin]
        };

        UseUserContext(
            new UserContext
            {
                UserId = user.Id,
                Roles = role == Roles.GlobalAdmin ? [role] : [],
                OrganizationRoles = role != Roles.GlobalAdmin
                    ?
                    [
                        unrelatedOrgAdminRole,
                        new OrganizationRole
                        {
                            OrganizationId = userOrgnization.OrganizationId,
                            RoleNames = [role]
                        }
                    ]
                    : [unrelatedOrgAdminRole]
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.OrganizationUserListRequest, CLI.Responses.Admin.UserListResponse>(
            new CLI.Requests.Admin.OrganizationUserListRequest
            {
                OrganizationId = userOrgnization.OrganizationId
            }
        );

        // Assert
        if (isAllowed)
        {
            result.Error.Should().BeNull();
            result.Users.Should().NotBeEmpty();
        }
        else
        {
            result.Error.Should().BeOfType<ForbiddenError>();
        }
    }
}