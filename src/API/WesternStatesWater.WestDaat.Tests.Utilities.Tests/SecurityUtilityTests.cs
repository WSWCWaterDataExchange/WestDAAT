using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tests.UtilitiesTests;

[TestClass]
public class SecurityUtilityTests : UtilitiesTestBase
{
    [TestMethod]
    public void Get_AnonymousContext_ShouldReceiveNoPermissions()
    {
        // Arrange
        var securityUtility = new SecurityUtility();

        // Act
        var permissions = securityUtility.Get(new PermissionsGetRequest
        {
            Context = new AnonymousContext()
        });

        // Assert
        permissions.Should().BeEmpty();
    }

    [TestMethod]
    public void Get_UserContext_GlobalAdmin_ShouldHaveAllPermissions()
    {
        // Arrange
        var securityUtility = new SecurityUtility();
        var userContext = new UserContext
        {
            Roles = [Roles.GlobalAdmin]
        };

        // Act
        var permissions = securityUtility.Get(new PermissionsGetRequest
        {
            Context = userContext
        });

        // Assert
        permissions.Should().BeEquivalentTo(Permissions.AllPermissions());
    }
    
    [TestMethod]
    public void Get_UserContext_FakeRole_ShouldHaveNoPermissions()
    {
        // Arrange
        var securityUtility = new SecurityUtility();
        var userContext = new UserContext
        {
            Roles = ["Fake Role"]
        };

        // Act
        var permissions = securityUtility.Get(new PermissionsGetRequest
        {
            Context = userContext
        });

        // Assert
        permissions.Should().BeEmpty();
    }

    [TestMethod]
    public void Get_UserContext_ShouldReceiveOrganizationPermissions()
    {
        // Arrange
        var securityUtility = new SecurityUtility();
        var organizationId = Guid.NewGuid();
        var userContext = new UserContext
        {
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organizationId,
                    RoleNames = ["Member"]
                }
            ]
        };

        // Act
        var permissions = securityUtility.Get(new OrganizationPermissionsGetRequest
        {
            Context = userContext,
            OrganizationId = organizationId
        });

        // Assert
        permissions.Should().Contain(Permissions.UserLoad);
    }

    [TestMethod]
    public void Get_UserContext_GetOrganizationPermissions_NotOrgMember_ShouldHaveNoPermission()
    {
        // Arrange
        var securityUtility = new SecurityUtility();
        var organizationId = Guid.NewGuid();
        var unrelatedOrganization = Guid.NewGuid();
        var userContext = new UserContext
        {
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organizationId,
                    RoleNames = ["Member"]
                }
            ]
        };

        // Act
        var permissions = securityUtility.Get(new OrganizationPermissionsGetRequest
        {
            Context = userContext,
            OrganizationId = unrelatedOrganization
        });

        // Assert
        permissions.Should().BeEmpty();
    }
}