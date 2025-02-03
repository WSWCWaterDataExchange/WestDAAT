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
    [DataRow("invalid global role", null, null, null, false, DisplayName = "A global user without required permissions should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", true, null, false, DisplayName = "An organization user without required permissions should throw a permission forbidden exception")]
    [DataRow(null, Roles.GlobalAdmin, true, null, false, DisplayName = "An organization user requesting all organizations should throw a permission forbidden exception")]
    [DataRow(null, Roles.GlobalAdmin, false, true, true, DisplayName = "An organization user requesting a specific organization to which they are a member should succeed")]
    [DataRow(null, Roles.GlobalAdmin, false, false, false, DisplayName = "An organization user requesting a specific organization to which they are not a member should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", false, true, false, DisplayName = "An organization user without required permissions requesting an organization to which they are a member should throw a permission forbidden exception")]
    [DataRow(null, "invalid org role", false, false, false, DisplayName = "An organization user without required permissions requesting an organization to which they are not a member should throw a permission forbidden exception")]
    public async Task Load_OrganizationApplicationDashboardRequest_ValidatePermissions(string? globalRole, string? orgRole, bool? requestingAllOrgs, bool? isMemberOfOrg, bool shouldPass)
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

    [TestMethod]
    public async Task Store_EstimateConsumptiveUse_AsUser_ShouldCreateNewEstimate()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.SaveChangesAsync();

        const int monthsInYear = 12;
        const int yearRange = 1;
        var rng = new Random();
        OpenEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<Common.DataContracts.RasterTimeSeriesPolygonRequest>()))
            .ReturnsAsync(new Common.DataContracts.RasterTimeSeriesPolygonResponse
            {
                Data = Enumerable.Range(0, monthsInYear).Select(_ => new Common.DataContracts.RasterTimeSeriesPolygonResponseDatapoint
                {
                    Time = DateOnly.FromDateTime(DateTime.Now),
                    Evapotranspiration = rng.NextDouble() * 10, // 0-10 inches each month - average ~5 inches
                })
                .ToArray()
            });

        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var firstCorner = "-96.70537000 40.82014318";
        var memorialStadium = "POLYGON ((" +
            firstCorner + ", " +
            "-96.70537429129318 40.82112749428667, " +
            "-96.70595069212823 40.82113037830751, " +
            "-96.70595263797125 40.82014685607426, " +
            firstCorner +
            "))";

        var request = new EstimateConsumptiveUseRequest
        {
            FundingOrganizationId = Guid.NewGuid(),
            OrganizationId = Guid.NewGuid(),
            WaterConservationApplicationId = application.Id,
            Polygons = [memorialStadium],
            DateRangeStart = DateOnly.FromDateTime(DateTime.Now.AddYears(-yearRange)),
            DateRangeEnd = DateOnly.FromDateTime(DateTime.Now),
            Model = Common.DataContracts.RasterTimeSeriesModel.SSEBop,
            CompensationRateDollars = 1000,
            Units = Common.DataContracts.CompensationRateUnits.AcreFeet,
        };

        // Act
        var response = await _applicationManager.Store<
            EstimateConsumptiveUseRequest,
            EstimateConsumptiveUseResponse>(
            request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().BeNull();
    }
}
