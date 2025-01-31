using System.ComponentModel;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
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
    [DataRow(Roles.GlobalAdmin, null, true, false, true, DisplayName = "A global user requesting all organizations should succeed")]
    [DataRow(Roles.GlobalAdmin, null, false, false, true, DisplayName = "A global user requesting a specific organization to which they are not a member should succeed")]
    [DataRow("invalid global role", null, false, false, false, DisplayName = "A global user without required permissions should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", true, false, false, DisplayName = "An organization user without required permissions should throw a permission forbidden exception")]
    [DataRow(null, Roles.GlobalAdmin, true, false, false, DisplayName = "An organization user requesting all organizations should throw a permission forbidden exception")]
    [DataRow(null, Roles.GlobalAdmin, false, true, true, DisplayName = "An organization user requesting a specific organization to which they are a member should succeed")]
    [DataRow(null, Roles.GlobalAdmin, false, false, false,
        DisplayName = "An organization user requesting a specific organization to which they are not a member should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", false, true, false,
        DisplayName = "An organization user without required permissions requesting an organization to which they are a member should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", false, false, false,
        DisplayName = "An organization user without required permissions requesting an organization to which they are not a member should throw a permission forbidden exception")]
    public async Task Load_OrganizationApplicationDashboardRequest_ValidatePermissions(string globalRole, string orgRole, bool requestingAllOrgs, bool isMemberOfOrg,
        bool shouldPass)
    {
        // Arrange
        var userOrganization = new OrganizationFaker().Generate();
        var diffOrganization = new OrganizationFaker().Generate();
        var user = new UserFaker().Generate();

        await _dbContext.Organizations.AddAsync(userOrganization);
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        var organizationRole = new OrganizationRole
        {
            OrganizationId = userOrganization.Id,
            RoleNames = [orgRole]
        };

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = globalRole != null ? [globalRole] : [],
            OrganizationRoles = orgRole != null ? [organizationRole] : [],
            ExternalAuthId = user.ExternalAuthId
        });

        Guid? requestedOrgId = null;

        if (requestingAllOrgs != true)
        {
            requestedOrgId = isMemberOfOrg == true ? userOrganization.Id : diffOrganization.Id;
        }

        var request = new OrganizationApplicationDashboardLoadRequest
        {
            OrganizationIdFilter = requestedOrgId
        };

        // Act
        var response = await _applicationManager.Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(request);

        // Assert
        response.GetType().Should().Be<OrganizationApplicationDashboardLoadResponse>();
        if (shouldPass)
        {
            // because accessor is throwing a NotImplementedException but it gets caught by ManagerBase
            response.Error.Should().NotBeNull();
            response.Error!.LogMessage.Should().BeNull();
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ForbiddenError>();
        }
    }

    // TODO: would this test belong here or be better suited in like an accessor test?
    [TestMethod]
    public async Task Load_OrganizationApplicationDashboardRequest_ReturnsExpectedApplications()
    {
        // Arrange
        var orgOne = new OrganizationFaker().Generate();
        var orgTwo = new OrganizationFaker().Generate();
        var orgThree = new OrganizationFaker().Generate();
        var userOne = new UserFaker().Generate();
        var userTwo = new UserFaker().Generate();
        var userThree = new UserFaker().Generate();
        var userProfileOne = new UserProfileFaker(userOne).Generate();
        var userProfileTwo = new UserProfileFaker(userTwo).Generate();
        var userProfileThree = new UserProfileFaker(userThree).Generate();
        var appOne = new WaterConservationApplicationFaker(userOne, orgOne).Generate();
        var appTwo = new WaterConservationApplicationFaker(userTwo, orgTwo).Generate();
        var appThree = new WaterConservationApplicationFaker(userThree, orgThree).Generate();
        var appFour = new WaterConservationApplicationFaker(userOne, orgOne).Generate();
        var subAppOne = new WaterConservationApplicationSubmissionFaker(appOne)
            .RuleFor(app => app.AcceptedDate, _ => new DateTimeOffset()).Generate();
        var subAppTwo = new WaterConservationApplicationSubmissionFaker(appTwo)
            .RuleFor(app => app.RejectedDate, _ => new DateTimeOffset()).Generate();
        var subAppFour = new WaterConservationApplicationSubmissionFaker(appFour).Generate();

        await _dbContext.Organizations.AddRangeAsync(orgOne, orgTwo, orgThree);
        await _dbContext.Users.AddRangeAsync(userOne, userTwo, userThree);
        await _dbContext.UserProfiles.AddRangeAsync(userProfileOne, userProfileTwo, userProfileThree);
        await _dbContext.WaterConservationApplications.AddRangeAsync(appOne, appTwo, appThree, appFour);
        await _dbContext.WaterConservationApplicationSubmissions.AddRangeAsync(subAppOne, subAppTwo, subAppFour);
        await _dbContext.SaveChangesAsync();
        
        var appOneResponse = new OrganizationApplicationDashboardListItem()
        {
            ApplicationId = appOne.Id,
            ApplicationDisplayId = appOne.ApplicationDisplayId,
            ApplicantFullName = $"{userProfileOne.FirstName} {userProfileOne.LastName}",
            OrganizationName = orgOne.Name,
            WaterRightNativeId = appOne.WaterRightNativeId,
            SubmittedDate = subAppOne.SubmittedDate,
            Status = ConservationApplicationStatus.Approved
        };
        
        var appTwoResponse = new OrganizationApplicationDashboardListItem()
        {
            ApplicationId = appTwo.Id,
            ApplicationDisplayId = appTwo.ApplicationDisplayId,
            ApplicantFullName = $"{userProfileTwo.FirstName} {userProfileTwo.LastName}",
            OrganizationName = orgTwo.Name,
            WaterRightNativeId = appTwo.WaterRightNativeId,
            SubmittedDate = subAppTwo.SubmittedDate,
            Status = ConservationApplicationStatus.Rejected
        };
        
        var appFourResponse = new OrganizationApplicationDashboardListItem()
        {
            ApplicationId = appFour.Id,
            ApplicationDisplayId = appFour.ApplicationDisplayId,
            ApplicantFullName = $"{userProfileOne.FirstName} {userProfileOne.LastName}",
            OrganizationName = orgOne.Name,
            WaterRightNativeId = appFour.WaterRightNativeId,
            SubmittedDate = subAppFour.SubmittedDate,
            Status = ConservationApplicationStatus.InReview
        };

        UseUserContext(new UserContext
        {
            UserId = new Guid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = "some-external-auth-id"
        });

        var request = new OrganizationApplicationDashboardLoadRequest();

        // Act
        var response = await _applicationManager.Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(request);

        // Assert
        response.GetType().Should().Be<OrganizationApplicationDashboardLoadResponse>();
        response.Applications.Should().HaveCount(3);
        response.Applications.Should().BeEquivalentTo([appOneResponse,appTwoResponse,appFourResponse]);
    }
}