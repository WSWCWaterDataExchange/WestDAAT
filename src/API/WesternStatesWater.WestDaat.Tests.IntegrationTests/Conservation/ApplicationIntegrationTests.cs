using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;
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

    private const string memorialStadiumFootballField = "POLYGON ((" +
            "-96.70537000 40.82014318, " +
            "-96.70537429129318 40.82112749428667, " +
            "-96.70595069212823 40.82113037830751, " +
            "-96.70595263797125 40.82014685607426, " +
            "-96.70537000 40.82014318" +
            "))";
    private const double memorialStadiumApproximateAreaInAcres = 1.32;

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
            requestedOrgId = isMemberOfOrg ? userOrganization.Id : diffOrganization.Id;
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
            response.Error.Should().BeNull();
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.Should().BeOfType<ForbiddenError>();
        }
    }

    [DataTestMethod]
    [DataRow(true, DisplayName = "A user with global admin role should be able to load all applications")]
    [DataRow(false, DisplayName = "An organization user should be able to load only their organization's applications")]
    public async Task Load_OrganizationApplicationDashboardRequest_ReturnsApplicationsNewestToOldest(bool isGlobalUser)
    {
        // Arrange
        var orgOne = new OrganizationFaker().Generate();
        var orgTwo = new OrganizationFaker().Generate();
        var orgThree = new OrganizationFaker().Generate();

        var userOne = new UserFaker().Generate();
        var userTwo = new UserFaker().Generate();
        var userThree = new UserFaker().Generate();

        var appOne = new WaterConservationApplicationFaker(userOne, orgOne).Generate();
        var appTwo = new WaterConservationApplicationFaker(userTwo, orgTwo).Generate();
        var appThree = new WaterConservationApplicationFaker(userThree, orgThree).Generate();
        var appFour = new WaterConservationApplicationFaker(userOne, orgOne).Generate();

        var acceptedEstimate = new WaterConservationApplicationEstimateFaker(appOne)
            .RuleFor(est => est.CompensationRateDollars, _ => 1000)
            .Generate();

        var rejectedEstimate = new WaterConservationApplicationEstimateFaker(appTwo)
            .RuleFor(est => est.CompensationRateDollars, _ => 500)
            .Generate();

        // skip estimate for app 3

        var inReviewEstimate = new WaterConservationApplicationEstimateFaker(appFour)
            .RuleFor(est => est.CompensationRateDollars, _ => 2000)
            .Generate();

        var acceptedApp = new WaterConservationApplicationSubmissionFaker(appOne)
            .RuleFor(app => app.AcceptedDate, _ => DateTimeOffset.Now).Generate();
        var rejectedApp = new WaterConservationApplicationSubmissionFaker(appTwo)
            .RuleFor(app => app.RejectedDate, _ => DateTimeOffset.Now).Generate();
        var inReviewApp = new WaterConservationApplicationSubmissionFaker(appFour).Generate();

        await _dbContext.Organizations.AddRangeAsync(orgOne, orgTwo, orgThree);
        await _dbContext.Users.AddRangeAsync(userOne, userTwo, userThree);
        await _dbContext.WaterConservationApplications.AddRangeAsync(appOne, appTwo, appThree, appFour);
        await _dbContext.WaterConservationApplicationEstimates.AddRangeAsync(acceptedEstimate, rejectedEstimate, inReviewEstimate);
        await _dbContext.WaterConservationApplicationSubmissions.AddRangeAsync(acceptedApp, rejectedApp, inReviewApp);
        await _dbContext.SaveChangesAsync();

        var acceptedAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appOne.Id,
            ApplicationDisplayId = appOne.ApplicationDisplayId,
            ApplicantFullName = $"{userOne.UserProfile.FirstName} {userOne.UserProfile.LastName}",
            CompensationRateDollars = acceptedEstimate.CompensationRateDollars,
            CompensationRateUnits = acceptedEstimate.CompensationRateUnits,
            OrganizationName = orgOne.Name,
            Status = ConservationApplicationStatus.Approved,
            SubmittedDate = acceptedApp.SubmittedDate,
            WaterRightNativeId = appOne.WaterRightNativeId,
            TotalObligationDollars = acceptedEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = acceptedEstimate.TotalAverageYearlyConsumptionEtAcreFeet
        };

        var rejectedAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appTwo.Id,
            ApplicationDisplayId = appTwo.ApplicationDisplayId,
            ApplicantFullName = $"{userTwo.UserProfile.FirstName} {userTwo.UserProfile.LastName}",
            CompensationRateDollars = rejectedEstimate.CompensationRateDollars,
            CompensationRateUnits = rejectedEstimate.CompensationRateUnits,
            OrganizationName = orgTwo.Name,
            Status = ConservationApplicationStatus.Rejected,
            SubmittedDate = rejectedApp.SubmittedDate,
            WaterRightNativeId = appTwo.WaterRightNativeId,
            TotalObligationDollars = rejectedEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = rejectedEstimate.TotalAverageYearlyConsumptionEtAcreFeet
        };

        var inReviewAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appFour.Id,
            ApplicationDisplayId = appFour.ApplicationDisplayId,
            ApplicantFullName = $"{userOne.UserProfile.FirstName} {userOne.UserProfile.LastName}",
            CompensationRateDollars = inReviewEstimate.CompensationRateDollars,
            CompensationRateUnits = inReviewEstimate.CompensationRateUnits,
            OrganizationName = orgOne.Name,
            Status = ConservationApplicationStatus.InReview,
            SubmittedDate = inReviewApp.SubmittedDate,
            WaterRightNativeId = appFour.WaterRightNativeId,
            TotalObligationDollars = inReviewEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = inReviewEstimate.TotalAverageYearlyConsumptionEtAcreFeet
        };

        var orgUserOrganizationRoles = new[]
        {
            new OrganizationRole
            {
                OrganizationId = orgOne.Id,
                RoleNames = [Roles.OrganizationAdmin]
            }
        };

        UseUserContext(new UserContext
        {
            UserId = Guid.Empty,
            Roles = isGlobalUser ? [Roles.GlobalAdmin] : [],
            OrganizationRoles = isGlobalUser ? [] : orgUserOrganizationRoles,
            ExternalAuthId = "some-external-auth-id"
        });

        var request = new OrganizationApplicationDashboardLoadRequest
        {
            OrganizationIdFilter = isGlobalUser ? null : orgOne.Id
        };

        // Act
        var response = await _applicationManager.Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(request);

        // Assert
        response.Error.Should().BeNull();

        var expectedApplications = new List<ApplicationDashboardListItem> { acceptedAppResponse, inReviewAppResponse };

        if (isGlobalUser)
        {
            expectedApplications = expectedApplications.Append(rejectedAppResponse).ToList();
        }

        response.Should().BeEquivalentTo(new OrganizationApplicationDashboardLoadResponse
        {
            Applications = expectedApplications.OrderByDescending(x => x.SubmittedDate).ToArray(),
        });
    }

    [DataTestMethod]
    [DataRow(false, true, DisplayName = "Create new estimate")]
    [DataRow(true, true, DisplayName = "Overwrite existing estimate")]
    [DataRow(false, false, DisplayName = "Request without compensation should not save estimate")]
    public async Task Store_EstimateConsumptiveUse_AsUser_Success(
        bool shouldInitializePreviousEstimate,
        bool requestShouldIncludeCompensationInfo
    )
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);

        WaterConservationApplicationEstimate estimate = null;
        if (shouldInitializePreviousEstimate)
        {
            estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
            var estimateLocation = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate();
            var estimateLocationConsumptiveUses = new WaterConservationApplicationEstimateLocationConsumptiveUseFaker(estimateLocation).Generate(12);

            await _dbContext.WaterConservationApplicationEstimateLocationConsumptiveUses.AddRangeAsync(estimateLocationConsumptiveUses);
        }

        await _dbContext.SaveChangesAsync();

        if (shouldInitializePreviousEstimate)
        {
            estimate.Id.Should().NotBe(Guid.Empty);
            var estimateCreated = await _dbContext.WaterConservationApplicationEstimates
                .AnyAsync(e => e.Id == estimate.Id);
            estimateCreated.Should().BeTrue();
        }


        const int monthsInYear = 12;
        const int startYear = 2024;
        const int yearRange = 1;
        OpenEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<Common.DataContracts.RasterTimeSeriesPolygonRequest>()))
            .ReturnsAsync(new Common.DataContracts.RasterTimeSeriesPolygonResponse
            {
                Data = Enumerable.Range(0, yearRange).Select(yearOffset =>
                {
                    var time = DateOnly.FromDateTime(new DateTime(startYear + yearOffset, 1, 1));
                    return Enumerable.Range(0, monthsInYear).Select(_ => new Common.DataContracts.RasterTimeSeriesPolygonResponseDatapoint
                    {
                        Time = time,
                        Evapotranspiration = 5, // 5in/month = 60in/year = 5ft/year
                    });
                })
                .SelectMany(monthlyData => monthlyData)
                .ToArray()
            });


        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var requestedCompensationPerAcreFoot = 1000;
        var request = new EstimateConsumptiveUseRequest
        {
            FundingOrganizationId = organization.Id,
            WaterConservationApplicationId = application.Id,
            WaterRightNativeId = application.WaterRightNativeId,
            Polygons = [memorialStadiumFootballField],
            DateRangeStart = DateOnly.FromDateTime(new DateTime(startYear, 1, 1)),
            DateRangeEnd = DateOnly.FromDateTime(new DateTime(startYear + yearRange, 1, 1)),
            Model = Common.DataContracts.RasterTimeSeriesModel.SSEBop,
        };

        if (requestShouldIncludeCompensationInfo)
        {
            request.CompensationRateDollars = requestedCompensationPerAcreFoot;
            request.Units = Common.DataContracts.CompensationRateUnits.AcreFeet;
        }


        // Act
        var response = await _applicationManager.Store<
            EstimateConsumptiveUseRequest,
            EstimateConsumptiveUseResponse>(
            request);


        // Assert
        response.Should().NotBeNull();
        response.Error.Should().BeNull();


        // verify response calculations are correct
        const int knownAvgYearlyEtInches = 60;
        var knownAvgYearlyEtFeet = knownAvgYearlyEtInches / 12;
        var expectedAvgYearlyEtAcreFeet = knownAvgYearlyEtFeet * memorialStadiumApproximateAreaInAcres;
        response.TotalAverageYearlyEtAcreFeet.Should().BeApproximately(expectedAvgYearlyEtAcreFeet, 0.01);

        if (requestShouldIncludeCompensationInfo)
        {
            var expectedConservationPayment = requestedCompensationPerAcreFoot * response.TotalAverageYearlyEtAcreFeet;
            response.ConservationPayment.Should().NotBeNull();
            response.ConservationPayment.Should().Be((int)expectedConservationPayment);
        }
        else
        {
            response.ConservationPayment.Should().BeNull();
        }

        // verify db entries were either created, created and overwritten, or not created at all
        var dbEstimate = await _dbContext.WaterConservationApplicationEstimates
            .Include(estimate => estimate.Locations)
            .ThenInclude(location => location.ConsumptiveUses)
            .SingleOrDefaultAsync(estimate => estimate.WaterConservationApplicationId == application.Id);
        var dbEstimateLocation = dbEstimate?.Locations.First();
        var dbEstimateLocationConsumptiveUses = dbEstimateLocation?.ConsumptiveUses;

        if (requestShouldIncludeCompensationInfo)
        {
            // verify db entries were created successfully
            dbEstimate.Should().NotBeNull();
            dbEstimate.Locations.Should().HaveCount(1); // 1 polygon
            dbEstimate.Locations.First().ConsumptiveUses.Should().HaveCount(yearRange); // monthly datapoints are grouped by year

            // verify db fields all match expectations
            dbEstimate.WaterConservationApplicationId.Should().Be(application.Id);
            dbEstimate.Model.Should().Be(request.Model);
            dbEstimate.DateRangeStart.Should().Be(request.DateRangeStart);
            dbEstimate.DateRangeEnd.Should().Be(request.DateRangeEnd);
            dbEstimate.CompensationRateDollars.Should().Be(request.CompensationRateDollars);
            dbEstimate.CompensationRateUnits.Should().Be(request.Units.Value);
            dbEstimate.EstimatedCompensationDollars.Should().Be(response.ConservationPayment.Value);
            dbEstimate.TotalAverageYearlyConsumptionEtAcreFeet.Should().BeApproximately(expectedAvgYearlyEtAcreFeet, 0.01);
            
            dbEstimateLocation.PolygonWkt.Should().Be(request.Polygons[0]);
            dbEstimateLocation.PolygonAreaInAcres.Should().BeApproximately(memorialStadiumApproximateAreaInAcres, 0.01);

            dbEstimateLocationConsumptiveUses.All(consumptiveUse =>
            {
                var yearMatches = consumptiveUse.Year >= startYear && consumptiveUse.Year < startYear + yearRange;
                return yearMatches;
            }).Should().BeTrue();
            dbEstimateLocationConsumptiveUses.Select(cu => cu.EtInInches).Sum().Should().Be(knownAvgYearlyEtInches);

            if (shouldInitializePreviousEstimate)
            {
                // verify db entries were overwritten successfully
                dbEstimate.Id.Should().NotBe(estimate.Id);

                dbEstimateLocation.Id.Should().NotBe(estimate.Locations.First().Id);

                var previousConsumptiveUsesIds = estimate.Locations.First().ConsumptiveUses.Select(cu => cu.Id).ToHashSet();
                dbEstimateLocationConsumptiveUses.All(cu => previousConsumptiveUsesIds.Contains(cu.Id))
                    .Should().BeFalse();
            }
        }
        else
        {
            // verify db entries were not created
            dbEstimate.Should().BeNull();
        }
    }

    [TestMethod]
    public async Task Store_EstimateConsumptiveUse_AsAnonymous_Failure()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);

        await _dbContext.SaveChangesAsync();

        const int startYear = 2024;
        OpenEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<Common.DataContracts.RasterTimeSeriesPolygonRequest>()))
            .ReturnsAsync(new Common.DataContracts.RasterTimeSeriesPolygonResponse
            {
                Data = [
                    new Common.DataContracts.RasterTimeSeriesPolygonResponseDatapoint
                    {
                        Time = DateOnly.FromDateTime(new DateTime(startYear, 1, 1)),
                        Evapotranspiration = 5,
                    }
                ]
            });

        ContextUtilityMock.Setup(x => x.GetRequiredContext<UserContext>())
            .Throws(new InvalidOperationException("User context is required for this operation"));

        UseAnonymousContext();

        var request = new EstimateConsumptiveUseRequest
        {
            FundingOrganizationId = organization.Id,
            WaterConservationApplicationId = application.Id,
            WaterRightNativeId = application.WaterRightNativeId,
            Polygons = [memorialStadiumFootballField],
            DateRangeStart = DateOnly.FromDateTime(new DateTime(startYear, 1, 1)),
            DateRangeEnd = DateOnly.FromDateTime(new DateTime(startYear + 1, 1, 1)),
            Model = Common.DataContracts.RasterTimeSeriesModel.SSEBop,
        };

        // Act
        var response = await _applicationManager.Store<
            EstimateConsumptiveUseRequest,
            EstimateConsumptiveUseResponse>(
            request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().NotBeNull();

        ContextUtilityMock.Verify(x => x.GetRequiredContext<UserContext>(), Times.Once);
    }

    [TestMethod]
    public async Task Store_CreateWaterConservationApplication_Success()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var request = new CLI.Requests.Conservation.WaterConservationApplicationCreateRequest
        {
            FundingOrganizationId = organization.Id,
            WaterRightNativeId = "1234",
        };

        // Act
        var response = await _applicationManager.Store<
            CLI.Requests.Conservation.WaterConservationApplicationCreateRequest,
            CLI.Responses.Conservation.WaterConservationApplicationCreateResponse>(request);

        // Assert
        response.Should().NotBeNull();
        response.WaterConservationApplicationId.Should().NotBeEmpty();

        var dbApplication = await _dbContext.WaterConservationApplications
            .SingleOrDefaultAsync(application => application.Id == response.WaterConservationApplicationId);
        dbApplication.Should().NotBeNull();
    }
}
