using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;

namespace WesternStatesWater.WestDaat.Tests.AccessorTests;

[TestClass]
public class ApplicationAccessorTests : AccessorTestBase
{
    private IApplicationAccessor _accessor;

    private WestDaatDatabaseContext _westDaatDb;

    [TestInitialize]
    public void TestInitialize()
    {
        var dbContextFactory = CreateDatabaseContextFactory();
        var westDaatDbContextFactory = CreateWestDaatDatabaseContextFactory();

        _accessor = new ApplicationAccessor(
            CreateLogger<ApplicationAccessor>(),
            dbContextFactory,
            westDaatDbContextFactory
        );

        _westDaatDb = westDaatDbContextFactory.Create();
    }

    [TestMethod]
    public async Task Load_CheckInProgressApplicationExists_ApplicationExistsWithNoSubmissions_ShouldReturnInProgressApplicationId()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _westDaatDb.WaterConservationApplications.AddAsync(application);
        await _westDaatDb.SaveChangesAsync();

        var request = new UnsubmittedApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (UnsubmittedApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.InProgressApplicationId.Should().Be(application.Id);
    }

    [TestMethod]
    public async Task Load_CheckInProgressApplicationExists_ApplicationExistsWithSubmissions_ShouldReturnNullId()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        await _westDaatDb.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _westDaatDb.SaveChangesAsync();

        var request = new UnsubmittedApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (UnsubmittedApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.InProgressApplicationId.Should().BeNull();
    }

    [TestMethod]
    public async Task Load_CheckInProgressApplicationExists_ApplicationDoesNotExist_ShouldReturnNullId()
    {
        // Arrange
        var user = new UserFaker().Generate();

        await _westDaatDb.Users.AddAsync(user);
        await _westDaatDb.SaveChangesAsync();

        var request = new UnsubmittedApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = "1234",
        };

        // Act
        var response = (UnsubmittedApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.InProgressApplicationId.Should().BeNull();
    }

    [DataTestMethod]
    [DataRow(null, 0, DisplayName = "Zero Applications exist -> return index 0")]
    // Application should not exist with id "<year>-<agencyId>-0000"
    [DataRow("0001", 1, DisplayName = "One Application exists -> return index 1")]
    [DataRow("0002", 2, DisplayName = "Two Applications exist -> return index 2")]
    [DataRow("9999", 9_999, DisplayName = "9,999 Applications -> return index 9,999")]
    [DataRow("10000", 10_000, DisplayName = "10,000 Applications -> return index 10,000")]
    [DataRow("999999", 999_999, DisplayName = "999,999 Applications -> return index 999,999")]
    [DataRow("1000000", 1_000_000, DisplayName = "1,000,000 Applications -> return index 1,000,000")]
    public async Task Load_FindSequentialDisplayId_Success(string lastSequentialNumber, int expectedSequentialNumber)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        await _westDaatDb.Users.AddAsync(user);
        await _westDaatDb.Organizations.AddAsync(organization);

        if (!string.IsNullOrEmpty(lastSequentialNumber))
        {
            var application = new WaterConservationApplicationFaker(user, organization)
                .RuleFor(app => app.ApplicationDisplayId, () => $"2025-{organization.AbbreviatedName}-{lastSequentialNumber}")
                .Generate();
            await _westDaatDb.WaterConservationApplications.AddRangeAsync(application);
        }

        await _westDaatDb.SaveChangesAsync();

        var request = new ApplicationFindSequentialIdLoadRequest
        {
            ApplicationDisplayIdStub = $"2025-{organization.AbbreviatedName}"
        };

        // Act
        var response = (ApplicationFindSequentialIdLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.LastDisplayIdSequentialNumber.Should().Be(expectedSequentialNumber);
    }

    [TestMethod]
    public async Task Store_CreateWaterConservationApplication_ShouldCreateApplication()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();

        await _westDaatDb.Users.AddAsync(user);
        await _westDaatDb.Organizations.AddAsync(organization);
        await _westDaatDb.SaveChangesAsync();

        var request = new WaterConservationApplicationCreateRequest
        {
            ApplicantUserId = user.Id,
            FundingOrganizationId = organization.Id,
            WaterRightNativeId = "1234",
            ApplicationDisplayId = "1234",
        };

        // Act
        var response = (WaterConservationApplicationCreateResponse)await _accessor.Store(request);

        // Assert
        response.Should().NotBeNull();
        response.WaterConservationApplicationId.Should().NotBeEmpty();

        var application = await _westDaatDb.WaterConservationApplications
            .SingleOrDefaultAsync(wca => wca.Id == response.WaterConservationApplicationId);
        application.Should().NotBeNull();
        application.ApplicantUserId.Should().Be(request.ApplicantUserId);
        application.FundingOrganizationId.Should().Be(request.FundingOrganizationId);
        application.WaterRightNativeId.Should().Be(request.WaterRightNativeId);
        application.ApplicationDisplayId.Should().Be(request.ApplicationDisplayId);
    }
}