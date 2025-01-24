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
        var context = new UserContext()
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        };
        ContextUtilityMock.Setup(mock => mock.GetContext())
            .Returns(context);

        var organization = new OrganizationFaker().Generate();
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.SaveChangesAsync();

        // Act 
        var response = await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(
            new OrganizationLoadAllRequest()
            {
            });

        // Assert
        response.GetType().Should().Be<OrganizationLoadAllResponse>();
        response.Error.Should().BeNull();
        response.Organizations.Should().HaveCount(1);
        response.Organizations[0].Name.Should().Be("organization1");
        response.Organizations[0].UserCount.Should().Be(1);
        response.Organizations[0].EmailDomain.Should().Be("organization1.com");
    }

    [DataTestMethod]
    [DataRow(Roles.Member)]
    [DataRow(Roles.TechnicalReviewer)]
    [DataRow(Roles.OrganizationAdmin)]
    [DataRow("Fake role")]
    public async Task Load_OrganizationLoadAllRequest_NotGlobalAdminUser_ShouldReturnError(string role)
    {
        // Arrange
        var context = new UserContext()
        {
            UserId = Guid.NewGuid(),
            Roles = [role],
            OrganizationRoles = [],
            ExternalAuthId = ""
        };

        ContextUtilityMock.Setup(mock => mock.GetContext())
            .Returns(context);

        // Act 
        var response = await _organizationManager.Load<OrganizationLoadAllRequest, OrganizationLoadAllResponse>(
            new OrganizationLoadAllRequest()
            {
            });

        // Assert
        response.GetType().Should().Be<OrganizationLoadAllResponse>();
        response.Organizations.Should().BeNull();
        response.Error.Should().NotBeNull();
        response.Error!.LogMessage.Should().Contain("but did not have permission to do so.");
    }
}