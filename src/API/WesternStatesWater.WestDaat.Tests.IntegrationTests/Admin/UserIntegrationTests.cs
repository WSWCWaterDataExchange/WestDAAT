using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common.Context;
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

    [TestMethod]
    public async Task Load_EnrichJwtRequest_NewUser_MissingEmail_ShouldThrow()
    {
        // Arrange
        UseIdentityProviderContext();

        // Act
        var request = new CLI.Requests.Admin.EnrichJwtRequest
        {
            ObjectId = "1234",
        };
        var response = await _userManager.Load<CLI.Requests.Admin.EnrichJwtRequest, CLI.Responses.Admin.EnrichJwtResponse>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error!.Should().BeOfType<ValidationError>();
        response.Error!.LogMessage.Should().Contain("Email is required.");
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
        var userOrganization = new UserOrganizationFaker(user, organization).Generate();
        var userRoles = new UserRoleFaker(user).Generate(1);
        userRoles[0].Role = role;

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
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
                            OrganizationId = userOrganization.OrganizationId,
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
        var userOrganization = new UserOrganizationFaker(user, organization).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
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
                            OrganizationId = userOrganization.OrganizationId,
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
        var userOrganization = new UserOrganizationFaker(user, organization).Generate();
        var unrelatedUserOrganization = new UserOrganizationFaker(user, unrelatedOrganization).Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Organizations.AddAsync(unrelatedOrganization);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
        await _dbContext.UserOrganizations.AddAsync(unrelatedUserOrganization);
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
                            OrganizationId = userOrganization.OrganizationId,
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
                OrganizationId = userOrganization.OrganizationId
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

    [TestMethod]
    public async Task Load_OrganizationUserListRequest_MultipleOrganizations_ShouldFilterToRequestedOrg()
    {
        // Arrange
        var users = new UserFaker().Generate(3);
        var unrelatedUsers = new UserFaker().Generate(3);
        var organization = new OrganizationFaker().Generate();
        var unrelatedOrganization = new OrganizationFaker().Generate();

        // Should be included in results
        var userOrganization1 = new UserOrganizationFaker(users[0], organization).Generate();
        var userOrganization2 = new UserOrganizationFaker(users[1], organization).Generate();
        var userOrganization3 = new UserOrganizationFaker(users[2], organization).Generate();

        userOrganization1.UserOrganizationRoles.Add(new UserOrganizationRoleFaker(userOrganization1).Generate());
        userOrganization2.UserOrganizationRoles.Add(new UserOrganizationRoleFaker(userOrganization2).Generate());
        userOrganization3.UserOrganizationRoles.Add(new UserOrganizationRoleFaker(userOrganization3).Generate());

        // Should not be included in results
        var unrelatedUserOrganization1 = new UserOrganizationFaker(unrelatedUsers[0], unrelatedOrganization).Generate();
        var unrelatedUserOrganization2 = new UserOrganizationFaker(unrelatedUsers[1], unrelatedOrganization).Generate();
        var unrelatedUserOrganization3 = new UserOrganizationFaker(unrelatedUsers[2], unrelatedOrganization).Generate();

        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.Users.AddRangeAsync(unrelatedUsers);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.Organizations.AddAsync(unrelatedOrganization);
        await _dbContext.UserOrganizations.AddRangeAsync(userOrganization1, userOrganization2, userOrganization3);
        await _dbContext.UserOrganizations.AddRangeAsync(unrelatedUserOrganization1, unrelatedUserOrganization2, unrelatedUserOrganization3);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = users[0].Id,
                Roles = [Roles.GlobalAdmin],
                OrganizationRoles = []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.OrganizationUserListRequest, CLI.Responses.Admin.UserListResponse>(
            new CLI.Requests.Admin.OrganizationUserListRequest
            {
                OrganizationId = organization.Id
            }
        );

        // Assert
        result.Error.Should().BeNull();
        result.Users.Should().HaveCount(3);

        // Has the users we expected
        result.Users.Any(u => u.UserId == users[0].Id).Should().BeTrue();
        result.Users.Any(u => u.UserId == users[1].Id).Should().BeTrue();
        result.Users.Any(u => u.UserId == users[2].Id).Should().BeTrue();

        result.Users.All(u => !string.IsNullOrEmpty(u.FirstName));
        result.Users.All(u => !string.IsNullOrEmpty(u.LastName));
        result.Users.All(u => !string.IsNullOrEmpty(u.UserName));
        result.Users.All(u => !string.IsNullOrEmpty(u.Email));
        result.Users.All(u => !string.IsNullOrEmpty(u.Role));
    }

    [DataTestMethod]
    [DataRow(Roles.Member)]
    [DataRow(Roles.TechnicalReviewer)]
    [DataRow(Roles.OrganizationAdmin)]
    [DataRow(Roles.GlobalAdmin)]
    public async Task Load_UserProfileRequest_NotSelf_ShouldThrow(string role)
    {
        // Arrange
        var currentUser = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var userOrganization = new UserOrganizationFaker(currentUser, organization).Generate();

        var stranger = new UserFaker().Generate();
        var strangerOrganization = new UserOrganizationFaker(stranger, organization).Generate();
        var strangerRoles = new UserRoleFaker(stranger).Generate(1);

        await _dbContext.Users.AddAsync(currentUser);
        await _dbContext.Users.AddAsync(stranger);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
        await _dbContext.UserOrganizations.AddAsync(strangerOrganization);
        await _dbContext.UserRoles.AddRangeAsync(strangerRoles);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = currentUser.Id,
                Roles = role == Roles.GlobalAdmin ? [role] : [],
                OrganizationRoles = role != Roles.GlobalAdmin
                    ?
                    [
                        new OrganizationRole
                        {
                            OrganizationId = userOrganization.OrganizationId,
                            RoleNames = [role]
                        }
                    ]
                    : []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserProfileRequest, CLI.Responses.Admin.UserProfileResponse>(
            new CLI.Requests.Admin.UserProfileRequest
            {
                UserId = stranger.Id // Different than current user, should throw
            }
        );

        // Assert
        result.Error.Should().BeOfType<ForbiddenError>();
    }

    [TestMethod]
    public async Task Load_UserProfileRequest_Self_Success()
    {
        // Arrange
        var currentUser = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var userOrganization = new UserOrganizationFaker(currentUser, organization).Generate();
        var userOrganizationRole = new UserOrganizationRoleFaker(userOrganization).Generate();

        await _dbContext.Users.AddAsync(currentUser);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.UserOrganizations.AddAsync(userOrganization);
        await _dbContext.UserOrganizationRoles.AddAsync(userOrganizationRole);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = currentUser.Id,
                Roles = [Roles.GlobalAdmin],
                OrganizationRoles = []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserProfileRequest, CLI.Responses.Admin.UserProfileResponse>(
            new CLI.Requests.Admin.UserProfileRequest
            {
                UserId = currentUser.Id // Same as current user, should succeed
            }
        );

        // Assert
        result.Error.Should().BeNull();
        result.UserProfile.Should().NotBeNull();
        result.UserProfile.UserId.Should().Be(currentUser.Id);
        result.UserProfile.FirstName.Should().Be(currentUser.UserProfile.FirstName);
        result.UserProfile.LastName.Should().Be(currentUser.UserProfile.LastName);
        result.UserProfile.UserName.Should().Be(currentUser.UserProfile.UserName);
        result.UserProfile.Email.Should().Be(currentUser.Email);
        result.UserProfile.OrganizationMemberships.Should().HaveCount(1);
        result.UserProfile.OrganizationMemberships.First().OrganizationId.Should().Be(organization.Id);
        result.UserProfile.OrganizationMemberships.First().OrganizationName.Should().Be(organization.Name);
        result.UserProfile.OrganizationMemberships.First().Role.Should().Be(userOrganizationRole.Role);
    }

    [TestMethod]
    public async Task Load_UserProfileRequest_NoProfile_ShouldNotThrow()
    {
        // Arrange
        var currentUser = new UserFaker()
            .RuleFor(u => u.UserProfile, _ => null)
            .Generate();

        await _dbContext.Users.AddAsync(currentUser);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = currentUser.Id,
                Roles = [],
                OrganizationRoles = []
            }
        );

        // Act
        var result = await _userManager.Load<CLI.Requests.Admin.UserProfileRequest, CLI.Responses.Admin.UserProfileResponse>(
            new CLI.Requests.Admin.UserProfileRequest
            {
                UserId = currentUser.Id // Same as current user, should succeed
            }
        );

        // Assert
        result.Error.Should().BeNull();
        result.UserProfile.IsSignupComplete.Should().BeFalse();
    }

    [TestMethod]
    public async Task Store_UpdateUserProfileRequest_ShouldUpdate()
    {
        // Arrange
        var currentUser = new UserFaker().Generate();
        await _dbContext.Users.AddAsync(currentUser);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = currentUser.Id,
            }
        );

        // Act
        await _userManager.Store<CLI.Requests.Admin.UserProfileUpdateRequest, CLI.Responses.Admin.UserStoreResponseBase>(
            new CLI.Requests.Admin.UserProfileUpdateRequest
            {
                FirstName = "Testie",
                LastName = "McTesterson",
                State = "NE",
                Country = "Canada",
                PhoneNumber = "123-456-7890",
                AffiliatedOrganization = "DPL"
            }
        );

        // Assert
        var updatedUser = await _dbContext.Users
            .Include(u => u.UserProfile)
            .SingleAsync(u => u.Id == currentUser.Id);

        updatedUser.UserProfile.FirstName.Should().Be("Testie");
        updatedUser.UserProfile.LastName.Should().Be("McTesterson");
        updatedUser.UserProfile.State.Should().Be("NE");
        updatedUser.UserProfile.Country.Should().Be("Canada");
        updatedUser.UserProfile.PhoneNumber.Should().Be("123-456-7890");
        updatedUser.UserProfile.AffiliatedOrganization.Should().Be("DPL");
    }

    [TestMethod]
    public async Task Store_UpdateUserProfileRequest_NoProfile_ShouldThrow()
    {
        // Arrange
        var currentUser = new UserFaker()
            .RuleFor(u => u.UserProfile, _ => null)
            .Generate();

        await _dbContext.Users.AddAsync(currentUser);
        await _dbContext.SaveChangesAsync();

        UseUserContext(
            new UserContext
            {
                UserId = currentUser.Id,
            }
        );

        // Act
        var result = await _userManager.Store<CLI.Requests.Admin.UserProfileUpdateRequest, CLI.Responses.Admin.UserStoreResponseBase>(
            new CLI.Requests.Admin.UserProfileUpdateRequest
            {
                FirstName = "Testie",
                LastName = "McTesterson",
                State = "NE",
                Country = "Canada",
                PhoneNumber = "123-456-7890"
            }
        );

        // Assert
        result.Error.Should().BeOfType<InternalError>();
        result.Error.LogMessage.Should().Contain($"User profile not found for id {currentUser.Id}");
    }
}