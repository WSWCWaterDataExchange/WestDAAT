using System.ComponentModel;
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
    [DataRow(Roles.GlobalAdmin, null, true, false, true, DisplayName = "ValidGlobalUser_AllOrgs_Success")]
    [DataRow(Roles.GlobalAdmin, null, false, false, true, DisplayName = "ValidGlobalUser_SpecificOrgs_IsNotAMember_Success")]
    [DataRow("invalid global role", null, null, null, false, DisplayName = "InvalidGlobalUser_ShouldThrow")]
    [DataRow(null, "invalid org role", true, null, false, DisplayName = "InvalidOrgUser_AllOrgs_ShouldThrow")]
    [DataRow(null, Roles.GlobalAdmin, true, null, false, DisplayName = "ValidOrgUser_AllOrgs_ShouldThrow")]
    [DataRow(null, Roles.GlobalAdmin, false, true, true, DisplayName = "ValidOrgUser_SpecificOrg_IsAMember_ShouldThrow")]
    [DataRow(null, Roles.GlobalAdmin, false, false, false, DisplayName = "ValidOrgUser_SpecificOrg_IsNotAMember_ShouldThrow")]
    [DataRow(null, "invalid org role", false, true, false, DisplayName = "InvalidOrgUser_SpecificOrg_IsAMember_ShouldThrow")]
    [DataRow(null, "invalid org role", false, false, false, DisplayName = "InvalidOrgUser_SpecificOrg_IsNotAMember_ShouldThrow")]
    public async Task Load_ApplicationDashboardRequest_ValidatePermissions(string? globalRole, string? orgRole, bool? requestingAllOrgs, bool? isMemberOfOrg, bool shouldPass)
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

        Guid? requestedOrgId = requestingAllOrgs == true ? null : isMemberOfOrg == true ? userOrganization.Id : diffOrganization.Id;

        var request = new ApplicationDashboardLoadRequest
        {
            OrganizationIdFilter = requestedOrgId
        };

        // Act
        var response = await _applicationManager.Load<ApplicationDashboardLoadRequest, ApplicationDashboardLoadResponse>(request);

        // Assert
        response.GetType().Should().Be<ApplicationDashboardLoadResponse>();
        if (shouldPass)
        {
            // because accessor is throwing a NotImplementedException but it gets caught by ManagerBase
            response.Error.Should().NotBeNull();
            response.Error!.LogMessage.Should().BeNull();
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error!.LogMessage.Should().Contain("attempted to make a request of type 'ApplicationDashboardLoadRequest', but did not have permission to do so.");
        }
    }
}