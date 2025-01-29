using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Tests.IntegrationTests.Conservation;

[TestClass]
public class ApplicationIntegrationTests : IntegrationTestBase
{
    private IApplicationManager _applicationManager;
    private Database.EntityFramework.WestDaatDatabaseContext _dbContext;

    [TestInitialize]
    public void TestInitialize()
    {
        _applicationManager = Services.GetRequiredService<IApplicationManager>();

        var dbContextFactory = Services.GetRequiredService<Database.EntityFramework.IWestDaatDatabaseContextFactory>();
        _dbContext = dbContextFactory.Create();
    }

    [TestMethod]
    public void SmokeTest() => _applicationManager.Should().NotBeNull();

    [TestMethod]
    public async Task Load_CalculateEvapotranspiration_AsUser_Success()
    {
        // Arrange
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

        // Act
        var request = new CLI.Requests.Conservation.EstimateEvapotranspirationRequest
        {
            FundingOrganizationId = Guid.NewGuid(),
            Polygons = ["POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))", "POLYGON ((0 0, 5 0, 5 5, 0 5, 0 0))"],
            DateRangeStart = DateOnly.FromDateTime(DateTime.Now.AddYears(-yearRange)),
            DateRangeEnd = DateOnly.FromDateTime(DateTime.Now),
            Model = Common.DataContracts.RasterTimeSeriesModel.SSEBop,
            Units = Common.DataContracts.DesiredCompensationUnits.AcreFeet,
            DesiredCompensation = 1000,
        };
        var response = await _applicationManager.Load<
            CLI.Requests.Conservation.EstimateEvapotranspirationRequest,
            CLI.Responses.Conservation.EstimateEvapotranspirationResponse>(
            request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().BeNull();

        response.AverageTotalEtInInches.Should().BeGreaterThanOrEqualTo(yearRange * request.Polygons.Length);
        response.AverageTotalEtInInches.Should().BeLessThanOrEqualTo(yearRange * request.Polygons.Length * 10);
    }
}