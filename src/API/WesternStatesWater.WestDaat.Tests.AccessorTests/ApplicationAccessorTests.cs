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

        var request = new InProgressApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (InProgressApplicationExistsLoadResponse)await _accessor.Load(request);

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

        var request = new InProgressApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (InProgressApplicationExistsLoadResponse)await _accessor.Load(request);

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

        var request = new InProgressApplicationExistsLoadRequest
        {
            ApplicantUserId = user.Id,
            WaterRightNativeId = "1234",
        };

        // Act
        var response = (InProgressApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.InProgressApplicationId.Should().BeNull();
    }

    [DataTestMethod]
    [DataRow(0, 0)]
    [DataRow(1, 1)]
    [DataRow(2, 2)]
    [DataRow(5, 5)]
    public async Task Load_FindSequentialDisplayId_Success(int numberOfApplicationsToGenerate, int expectedSequentialNumber)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var applications = Enumerable.Range(0, numberOfApplicationsToGenerate)
            .Select(index =>
                new WaterConservationApplicationFaker(user, organization)
                    .RuleFor(app => app.ApplicationDisplayId, () => $"2025-{organization.AgencyId}-{index + 1:D4}")
                    .Generate()
            )
            .ToArray();

        await _westDaatDb.WaterConservationApplications.AddRangeAsync(applications);
        await _westDaatDb.SaveChangesAsync();

        var request = new ApplicationFindSequentialIdLoadRequest
        {
            ApplicationDisplayIdStub = $"2025-{organization.AgencyId}"
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
            OrganizationId = organization.Id,
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
        application.ApplicantUserId.Should().Be(user.Id);
        application.FundingOrganizationId.Should().Be(organization.Id);
        application.WaterRightNativeId.Should().Be("1234");
        application.ApplicationDisplayId.Should().Be("1234");
    }
}