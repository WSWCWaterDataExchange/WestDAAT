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
    public async Task Load_CheckApplicationExists_ApplicationExistsWithNoSubmissions_ShouldReturnInProgressApplicationId()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _westDaatDb.WaterConservationApplications.AddAsync(application);
        await _westDaatDb.SaveChangesAsync();

        var request = new ApplicationExistsLoadRequest
        {
            HasSubmission = false,
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (ApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.ApplicationExists.Should().BeTrue();
        response.ApplicationId.Should().Be(application.Id);
        response.ApplicationDisplayId.Should().Be(application.ApplicationDisplayId);
        response.EstimateLocationIds.Should().BeEmpty();
    }

    [TestMethod]
    public async Task Load_CheckApplicationExists_ApplicationExistsWithSubmissions_ShouldReturnNullId()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        await _westDaatDb.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _westDaatDb.SaveChangesAsync();

        var request = new ApplicationExistsLoadRequest
        {
            HasSubmission = false,
            ApplicantUserId = user.Id,
            WaterRightNativeId = application.WaterRightNativeId
        };

        // Act
        var response = (ApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.ApplicationExists.Should().BeFalse();
        response.ApplicationId.Should().BeNull();
        response.ApplicationDisplayId.Should().BeNull();
        response.EstimateLocationIds.Should().BeEmpty();
    }

    [TestMethod]
    public async Task Load_CheckApplicationExists_ApplicationDoesNotExist_ShouldReturnNullId()
    {
        // Arrange
        var user = new UserFaker().Generate();

        await _westDaatDb.Users.AddAsync(user);
        await _westDaatDb.SaveChangesAsync();

        var request = new ApplicationExistsLoadRequest
        {
            HasSubmission = false,
            ApplicantUserId = user.Id,
            WaterRightNativeId = "1234",
        };

        // Act
        var response = (ApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();
        response.ApplicationExists.Should().BeFalse();
        response.ApplicationId.Should().BeNull();
        response.ApplicationDisplayId.Should().BeNull();
        response.EstimateLocationIds.Should().BeEmpty();
    }

    [DataTestMethod]
    [DataRow(false, false, false, DisplayName = "Application does not exist")]
    [DataRow(true, false, false, DisplayName = "Application exists but has no submission")]
    [DataRow(true, true, true, DisplayName = "Application exists and has submission")]
    public async Task Load_CheckApplicationExists_Success(
        bool applicationExists,
        bool applicationHasSubmission,
        bool expectedExists)
    {
        // Arrange
        WaterConservationApplication application = null;

        if (applicationExists)
        {
            var user = new UserFaker().Generate();
            var org = new OrganizationFaker().Generate();
            var applicationFaker = new WaterConservationApplicationFaker(user, org);

            if (applicationHasSubmission)
            {
                applicationFaker.RuleFor(app => app.Submission, () => new WaterConservationApplicationSubmissionFaker().Generate());
            }

            application = applicationFaker.Generate();

            await _westDaatDb.WaterConservationApplications.AddAsync(application);

            var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
            await _westDaatDb.WaterConservationApplicationEstimates.AddAsync(estimate);

            var locations = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate(3);
            await _westDaatDb.WaterConservationApplicationEstimateLocations.AddRangeAsync(locations);

            await _westDaatDb.SaveChangesAsync();
        }


        // Act
        var request = new ApplicationExistsLoadRequest
        {
            HasSubmission = true,
            ApplicationId = application?.Id ?? Guid.NewGuid()
        };
        var response = (ApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();

        response.ApplicationExists.Should().Be(expectedExists);

        if (expectedExists)
        {
            response.ApplicantUserId.Should().Be(application.ApplicantUserId);
            response.FundingOrganizationId.Should().Be(application.FundingOrganizationId);
            response.EstimateLocationIds.Should().BeEquivalentTo(application.Estimate.Locations.Select(loc => loc.Id).ToArray());
        }
        else
        {
            response.ApplicantUserId.Should().BeNull();
            response.FundingOrganizationId.Should().BeNull();
            response.EstimateLocationIds.Should().BeEmpty();
        }
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

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Store_UpdateApplicationEstimate_Success(bool shouldInitializeControlLocation)
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        await _westDaatDb.WaterConservationApplications.AddAsync(application);

        var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
        var locations = new WaterConservationApplicationEstimateLocationFaker(estimate)
            .RuleFor(loc => loc.AdditionalDetails, () => "Custom additional details")
            .Generate(2);
        var locationWaterMeasurements = locations.Select(location =>
            new LocationWaterMeasurementFaker(location).Generate(5)
        ).SelectMany(waterMeasurements => waterMeasurements)
        .ToArray();
        await _westDaatDb.LocationWaterMeasurements.AddRangeAsync(locationWaterMeasurements);

        WaterConservationApplicationEstimateControlLocation controlLocation = null;
        if (shouldInitializeControlLocation)
        {
            controlLocation = new WaterConservationApplicationEstimateControlLocationFaker(estimate).Generate();
            var controlLocationWaterMeasurements = new ControlLocationWaterMeasurementFaker(controlLocation).Generate(5);
            await _westDaatDb.ControlLocationWaterMeasurements.AddRangeAsync(controlLocationWaterMeasurements);
        }

        await _westDaatDb.SaveChangesAsync();

        string pointWkt = "POINT (5 5)",
               polygonWkt = "POLYGON ((1 1), (3 3), (5 5))";

        var request = new ApplicationEstimateUpdateRequest
        {
            // estimate data will be updated
            WaterConservationApplicationId = application.Id,
            CumulativeTotalEtInAcreFeet = 1000,
            CumulativeNetEtInAcreFeet = 800,
            EstimatedCompensationDollars = 5000,

            // control location will be updated, water measurements will be overwritten
            ControlLocation = new ApplicationEstimateStoreControlLocationDetails
            {
                PointWkt = pointWkt,
                WaterMeasurements = [
                    new ApplicationEstimateStoreControlLocationWaterMeasurementsDetails
                    {
                        Year = 2025,
                        TotalEtInInches = 5
                    }
                ]
            },

            // locations will be created/deleted/updated, water measurements will be created/deleted (not updated)
            Locations =
            [
                // update location
                new ApplicationEstimateUpdateLocationDetails
                {
                    WaterConservationApplicationEstimateLocationId = locations[0].Id,
                    PolygonWkt = polygonWkt,
                    DrawToolType = DrawToolType.Freeform,
                    PolygonAreaInAcres = 1,
                    ConsumptiveUses =
                    [
                        new ApplicationEstimateStoreLocationConsumptiveUseDetails
                        {
                            Year = 2025,
                            TotalEtInInches = 5,
                            EffectivePrecipitationInInches = 1,
                            NetEtInInches = 4
                        }
                    ]
                },
                // create new location
                new ApplicationEstimateUpdateLocationDetails
                {
                    WaterConservationApplicationEstimateLocationId = null,
                    PolygonWkt = polygonWkt,
                    DrawToolType = DrawToolType.Rectangle,
                    PolygonAreaInAcres = 2,
                    ConsumptiveUses =
                    [
                        new ApplicationEstimateStoreLocationConsumptiveUseDetails
                        {
                            Year = 2025,
                            TotalEtInInches = 10,
                            EffectivePrecipitationInInches = 2,
                            NetEtInInches = 8
                        }
                    ]
                }
            ]
        };

        // Act
        var response = (ApplicationEstimateUpdateResponse)await _accessor.Store(request);

        // Assert
        // validate response object
        response.Should().NotBeNull();
        response.Details.Should().NotBeNullOrEmpty();
        response.Details.Length.Should().Be(2);

        foreach (var location in response.Details)
        {
            location.WaterConservationApplicationEstimateLocationId.Should().NotBe(Guid.Empty);
            location.PolygonWkt.Should().Be(polygonWkt);
        }

        response.ControlLocationDetails.Should().NotBeNull();
        response.ControlLocationDetails.WaterConservationApplicationEstimateControlLocationId.Should().NotBe(Guid.Empty);
        response.ControlLocationDetails.PointWkt.Should().Be(pointWkt);

        // validate database entries
        var dbEstimate = await _westDaatDb.WaterConservationApplicationEstimates
            .Include(est => est.Locations).ThenInclude(location => location.WaterMeasurements)
            .Include(est => est.ControlLocations).ThenInclude(clocation => clocation.WaterMeasurements)
            .SingleOrDefaultAsync(est => est.Id == estimate.Id);

        // estiamte
        dbEstimate.Should().NotBeNull();
        dbEstimate.CumulativeTotalEtInAcreFeet.Should().Be(request.CumulativeTotalEtInAcreFeet);
        dbEstimate.CumulativeNetEtInAcreFeet.Should().Be(request.CumulativeNetEtInAcreFeet);
        dbEstimate.EstimatedCompensationDollars.Should().Be(request.EstimatedCompensationDollars);

        // locations
        dbEstimate.Locations.Should().HaveCount(request.Locations.Length);

        var unreferencedLocationWasDeleted = dbEstimate.Locations.All(location => location.Id != locations[1].Id);
        unreferencedLocationWasDeleted.Should().BeTrue();

        var updatedLocation = dbEstimate.Locations.Single(l => l.Id == locations[0].Id);
        updatedLocation.PolygonWkt.Should().Be(polygonWkt);
        updatedLocation.DrawToolType.Should().Be(request.Locations[0].DrawToolType);
        updatedLocation.PolygonAreaInAcres.Should().Be(request.Locations[0].PolygonAreaInAcres);
        // *important* this field should be carried over since the Location entry already existed
        updatedLocation.AdditionalDetails.Should().Be("Custom additional details");

        var newLocation = dbEstimate.Locations.Single(l => l.Id != locations[0].Id);
        newLocation.Id.Should().NotBe(locations[1].Id); // location 1 was deleted; just sanity-checking that it wasn't accidentally updated
        newLocation.PolygonWkt.Should().Be(polygonWkt);
        newLocation.DrawToolType.Should().Be(request.Locations[1].DrawToolType);
        newLocation.PolygonAreaInAcres.Should().Be(request.Locations[1].PolygonAreaInAcres);
        newLocation.AdditionalDetails.Should().BeNullOrEmpty();

        // location water measurements
        updatedLocation.WaterMeasurements.Should().HaveCount(1);

        var measurement1 = updatedLocation.WaterMeasurements.Single();
        measurement1.Year.Should().Be(request.Locations[0].ConsumptiveUses[0].Year);
        measurement1.TotalEtInInches.Should().Be(request.Locations[0].ConsumptiveUses[0].TotalEtInInches);
        measurement1.EffectivePrecipitationInInches.Should().Be(request.Locations[0].ConsumptiveUses[0].EffectivePrecipitationInInches);
        measurement1.NetEtInInches.Should().Be(request.Locations[0].ConsumptiveUses[0].NetEtInInches);

        var measurement2 = newLocation.WaterMeasurements.Single();
        measurement2.Year.Should().Be(request.Locations[1].ConsumptiveUses[0].Year);
        measurement2.TotalEtInInches.Should().Be(request.Locations[1].ConsumptiveUses[0].TotalEtInInches);
        measurement2.EffectivePrecipitationInInches.Should().Be(request.Locations[1].ConsumptiveUses[0].EffectivePrecipitationInInches);
        measurement2.NetEtInInches.Should().Be(request.Locations[1].ConsumptiveUses[0].NetEtInInches);

        // control location
        var dbControlLocation = dbEstimate.ControlLocations.Single();
        dbControlLocation.PointWkt.Should().Be(request.ControlLocation.PointWkt);

        if (shouldInitializeControlLocation)
        {
            dbControlLocation.Id.Should().Be(controlLocation.Id);
        }
        else
        {
            controlLocation.Should().BeNull();
            dbControlLocation.Id.Should().NotBe(Guid.Empty);
        }

        // control location water measurements
        var clMeasurement = dbControlLocation.WaterMeasurements.Single();
        clMeasurement.Year.Should().Be(request.ControlLocation.WaterMeasurements[0].Year);
        clMeasurement.TotalEtInInches.Should().Be(request.ControlLocation.WaterMeasurements[0].TotalEtInInches);
    }
}