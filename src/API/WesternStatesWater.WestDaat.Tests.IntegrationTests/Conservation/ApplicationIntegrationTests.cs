using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Transactions;
using WesternStatesWater.Shared.Errors;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.Constants;
using WesternStatesWater.WestDaat.Common.Context;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation;
using WesternStatesWater.WestDaat.Contracts.Client.Responses;
using WesternStatesWater.WestDaat.Contracts.Client.Responses.Conservation;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Tests.Helpers;
using WaterConservationApplicationSubmittedEvent = WesternStatesWater.WestDaat.Contracts.Client.Requests.Conservation.WaterConservationApplicationSubmittedEvent;

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
            WaterRightState = acceptedApp.WaterRightState,
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
            WaterRightState = rejectedApp.WaterRightState,
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
            WaterRightState = inReviewApp.WaterRightState,
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

    [TestMethod]
    public async Task Load_ConservationApplicationLoadRequest_MultipleRequestTypes_Success()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var org = new OrganizationFaker().Generate();

        var application = new WaterConservationApplicationFaker(user, org).Generate();
        await _dbContext.WaterConservationApplications.AddAsync(application);

        var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
        await _dbContext.WaterConservationApplicationEstimates.AddAsync(estimate);

        var locations = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate(3);
        await _dbContext.WaterConservationApplicationEstimateLocations.AddRangeAsync(locations);

        foreach (var location in locations)
        {
            var consumptiveUses = new WaterConservationApplicationEstimateLocationConsumptiveUseFaker(location).Generate(2);
            await _dbContext.WaterConservationApplicationEstimateLocationConsumptiveUses.AddRangeAsync(consumptiveUses);
        }

        var documents = new WaterConservationApplicationDocumentsFaker(application).Generate(2);
        await _dbContext.WaterConservationApplicationDocuments.AddRangeAsync(documents);

        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);

        var technicalReviewers = new UserFaker().Generate(2);
        await _dbContext.Users.AddRangeAsync(technicalReviewers);

        var notes = technicalReviewers.Select(user => new WaterConservationApplicationSubmissionNoteFaker(submission, user).Generate()).ToArray();
        await _dbContext.WaterConservationApplicationSubmissionNotes.AddRangeAsync(notes);

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id, // allows user to see Applicant view
            Roles = [Roles.GlobalAdmin], // allows user to see Reviewer view
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act
        var applicantRequest = new ApplicantConservationApplicationLoadRequest
        {
            ApplicationId = application.Id
        };
        var reviewerRequest = new ReviewerConservationApplicationLoadRequest
        {
            ApplicationId = application.Id
        };

        var applicantResponse = await _applicationManager.Load<ApplicantConservationApplicationLoadRequest, ApplicantConservationApplicationLoadResponse>(applicantRequest);
        var reviewerResponse = await _applicationManager.Load<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>(reviewerRequest);

        // Assert

        // ExcludingMissingMembers is used to ignore properties that are intentionally not included in the response
        // i.e. virtual navigation properties and parent id properties
        applicantResponse.Should().NotBeNull();
        applicantResponse.Application.Should().BeEquivalentTo(application, options => options.ExcludingMissingMembers());
        // the following assertions are redundant given that `BeEquivalentTo` checks properties recursively,
        // but are included for completeness just in case something changes in the future
        applicantResponse.Application.Estimate.Should().BeEquivalentTo(estimate, options => options.ExcludingMissingMembers());
        applicantResponse.Application.Estimate.Locations.Should().BeEquivalentTo(locations, options => options.ExcludingMissingMembers());
        applicantResponse.Application.Estimate.Locations.SelectMany(l => l.ConsumptiveUses).Should()
            .BeEquivalentTo(locations.SelectMany(l => l.ConsumptiveUses), options => options.ExcludingMissingMembers());
        applicantResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        applicantResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());

        reviewerResponse.Should().NotBeNull();
        reviewerResponse.Application.Should().BeEquivalentTo(application, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Should().BeEquivalentTo(estimate, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.Should().BeEquivalentTo(locations, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.SelectMany(l => l.ConsumptiveUses).Should()
            .BeEquivalentTo(locations.SelectMany(l => l.ConsumptiveUses), options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());
        reviewerResponse.Notes.Should().BeEquivalentTo(notes, options => options.ExcludingMissingMembers());

        // verify note fields with custom mappings are translated correctly
        foreach (var note in reviewerResponse.Notes)
        {
            note.SubmittedDate.Should().NotBe(default);
            note.SubmittedByFullName.Should().NotBeEmpty();
        }

        // verify notes are returned in order
        var expectedNoteOrder = reviewerResponse.Notes.Select(n => n.SubmittedDate).OrderBy(date => date);
        reviewerResponse.Notes.Select(n => n.SubmittedDate).Should().BeEquivalentTo(expectedNoteOrder, opt => opt.WithStrictOrdering());
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
        // perform db setup in custom transaction scope to avoid implicit distributed transactions error
        using var transactionScope = new TransactionScope(TransactionScopeOption.Suppress, new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
        }, TransactionScopeAsyncFlowOption.Enabled);

        var wadeDb = Services.GetRequiredService<IDatabaseContextFactory>().Create();

        // necessary since we're using a custom transaction scope
        var cleanupDatabase = async () =>
        {
            wadeDb.AllocationAmountsFact.RemoveRange(wadeDb.AllocationAmountsFact);
            wadeDb.OrganizationsDim.RemoveRange(wadeDb.OrganizationsDim);
            wadeDb.DateDim.RemoveRange(wadeDb.DateDim);
            wadeDb.MethodsDim.RemoveRange(wadeDb.MethodsDim);
            wadeDb.MethodType.RemoveRange(wadeDb.MethodType);
            wadeDb.ApplicableResourceType.RemoveRange(wadeDb.ApplicableResourceType);
            wadeDb.VariablesDim.RemoveRange(wadeDb.VariablesDim);
            wadeDb.VariableSpecific.RemoveRange(wadeDb.VariableSpecific);
            wadeDb.Variable.RemoveRange(wadeDb.Variable);
            wadeDb.AggregationStatistic.RemoveRange(wadeDb.AggregationStatistic);
            wadeDb.Units.RemoveRange(wadeDb.Units);
            wadeDb.ReportYearType.RemoveRange(wadeDb.ReportYearType);
            await wadeDb.SaveChangesAsync();

            _dbContext.WaterConservationApplicationEstimateLocationConsumptiveUses.RemoveRange(_dbContext.WaterConservationApplicationEstimateLocationConsumptiveUses);
            _dbContext.WaterConservationApplicationEstimateLocations.RemoveRange(_dbContext.WaterConservationApplicationEstimateLocations);
            _dbContext.WaterConservationApplicationEstimates.RemoveRange(_dbContext.WaterConservationApplicationEstimates);
            _dbContext.WaterConservationApplications.RemoveRange(_dbContext.WaterConservationApplications);
            _dbContext.UserProfiles.RemoveRange(_dbContext.UserProfiles);
            _dbContext.Users.RemoveRange(_dbContext.Users);
            _dbContext.Organizations.RemoveRange(_dbContext.Organizations);
            await _dbContext.SaveChangesAsync();
        };

        // run prior to test initialization in case previous run failed
        await cleanupDatabase();

        try
        {
            // Arrange
            const int monthsInYear = 12;
            const int startYear = 2024;
            const int yearRange = 1;

            var user = new UserFaker().Generate();
            var organization = new OrganizationFaker()
                .RuleFor(org => org.OpenEtDateRangeInYears, () => yearRange)
                .Generate();
            await _dbContext.Users.AddAsync(user);
            await _dbContext.Organizations.AddAsync(organization);
            await _dbContext.SaveChangesAsync();

            var waterRight = new AllocationAmountFactFaker()
                .RuleFor(aaf => aaf.ConservationApplicationFundingOrganizationId, () => organization.Id)
                .Generate();
            await wadeDb.AllocationAmountsFact.AddAsync(waterRight);
            await wadeDb.SaveChangesAsync();


            var application = new WaterConservationApplicationFaker()
                .RuleFor(a => a.ApplicantUserId, () => user.Id)
                .RuleFor(a => a.FundingOrganizationId, () => organization.Id)
                .RuleFor(a => a.WaterRightNativeId, () => waterRight.AllocationUuid)
                .Generate();

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
                WaterConservationApplicationId = application.Id,
                WaterRightNativeId = application.WaterRightNativeId,
                Polygons =
                [
                    new CLI.MapPolygon
                    {
                        PolygonWkt = memorialStadiumFootballField,
                        DrawToolType = DrawToolType.Freeform,
                    }
                ],
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
                dbEstimate.Model.Should().Be(organization.OpenEtModel);
                dbEstimate.DateRangeStart.Should().Be(
                    DateOnly.FromDateTime(
                        new DateTimeOffset(DateTimeOffset.UtcNow.Year - yearRange, 1, 1, 0, 0, 0, TimeSpan.Zero)
                            .UtcDateTime
                    )
                );
                dbEstimate.DateRangeEnd.Should().Be(
                    DateOnly.FromDateTime(
                        new DateTimeOffset(DateTimeOffset.UtcNow.Year, 1, 1, 0, 0, 0, TimeSpan.Zero)
                            .AddMinutes(-1)
                            .UtcDateTime
                    )
                );
                dbEstimate.CompensationRateDollars.Should().Be(request.CompensationRateDollars);
                dbEstimate.CompensationRateUnits.Should().Be(request.Units.Value);
                dbEstimate.EstimatedCompensationDollars.Should().Be(response.ConservationPayment.Value);
                dbEstimate.TotalAverageYearlyConsumptionEtAcreFeet.Should().BeApproximately(expectedAvgYearlyEtAcreFeet, 0.01);

                dbEstimateLocation.PolygonWkt.Should().Be(request.Polygons[0].PolygonWkt);
                dbEstimateLocation.DrawToolType.Should().Be(request.Polygons[0].DrawToolType);
                dbEstimateLocation.PolygonAreaInAcres.Should().BeApproximately(memorialStadiumApproximateAreaInAcres, 0.01);

                // double-check that the response data was cross-referenced successfully with the db EstimateLocations
                response.DataCollections.First().WaterConservationApplicationEstimateLocationId.Should().Be(dbEstimateLocation.Id);

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
        finally
        {
            // cleanup after test finishes to prevent issues with other tests
            await cleanupDatabase();
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
                Data =
                [
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
            WaterConservationApplicationId = application.Id,
            WaterRightNativeId = application.WaterRightNativeId,
            Polygons =
            [
                new CLI.MapPolygon
                {
                    PolygonWkt = memorialStadiumFootballField,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
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
        response.WaterConservationApplicationDisplayId.Should().NotBeNullOrEmpty();

        var dbApplication = await _dbContext.WaterConservationApplications
            .SingleOrDefaultAsync(application => application.Id == response.WaterConservationApplicationId);
        dbApplication.Should().NotBeNull();
    }

    [DataTestMethod]
    [DataRow(false, null, null, null, false, nameof(NotFoundError), DisplayName = "Application DNE -> should throw")]
    [DataRow(true, false, null, null, false, nameof(NotFoundError), DisplayName = "User does not have an in-progress Application for this water right -> should throw")]
    [DataRow(true, true, false, false, false, nameof(ForbiddenError),
        DisplayName = "User has an in-progress Application for this water right, but they attempted to create a Submission for a different Application -> should throw")]
    [DataRow(true, true, false, true, true, null,
        DisplayName = "User has an in-progress Application for this water right, and they attempted to create a Submission for the correct Application -> should succeed")]
    public async Task Store_SubmitApplication_Success(
        bool doesApplicationExist,
        bool? doesUserOwnApplication,
        bool? doesApplicationAlreadyHaveASubmission,
        bool? doesProvidedApplicationIdMatch,
        bool shouldSucceed,
        string expectedErrorTypeName
    )
    {
        // Arrange
        const string waterRightNativeId = "1234";

        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);

        WaterConservationApplication application = null;
        WaterConservationApplicationEstimateLocation[] estimateLocations = null;
        Database.EntityFramework.WaterConservationApplicationDocument[] documents = [];
        if (doesApplicationExist)
        {
            var applicationOwner = doesUserOwnApplication == true
                ? user
                : new UserFaker().Generate();

            application = new WaterConservationApplicationFaker(applicationOwner, organization)
                .RuleFor(app => app.WaterRightNativeId, () => waterRightNativeId)
                .Generate();
            documents = new WaterConservationApplicationDocumentsFaker(application, applicationOwner).Generate(3).ToArray();
            await _dbContext.WaterConservationApplications.AddAsync(application);

            var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
            await _dbContext.WaterConservationApplicationEstimates.AddAsync(estimate);

            estimateLocations = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate(1).ToArray();
            await _dbContext.WaterConservationApplicationEstimateLocations.AddRangeAsync(estimateLocations);

            if (doesApplicationAlreadyHaveASubmission == true)
            {
                var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
                await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
            }
        }

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        var request = new WaterConservationApplicationSubmissionRequestFaker()
            .RuleFor(req => req.WaterRightNativeId, () => waterRightNativeId)
            .RuleFor(req => req.WaterConservationApplicationId, () => doesProvidedApplicationIdMatch == true ? application!.Id : Guid.NewGuid())
            .RuleFor(req => req.FieldDetails, () => estimateLocations?.Select(location => new CLI.ApplicationSubmissionFieldDetail
            {
                WaterConservationApplicationEstimateLocationId = location.Id,
                AdditionalDetails = "Some additional details"
            }).ToArray() ?? [])
            .RuleFor(req => req.SupportingDocuments, () => documents.Select(document => new CLI.Requests.Conservation.WaterConservationApplicationDocument
            {
                BlobName = document.BlobName,
                FileName = document.FileName,
                Description = document.Description
            }).ToArray())
            .Generate();

        // Act
        var response = await _applicationManager.Store<
            CLI.Requests.Conservation.WaterConservationApplicationSubmissionRequest,
            CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Should().NotBeNull();

        if (shouldSucceed)
        {
            response.Error.Should().BeNull();

            var dbApplication = await _dbContext.WaterConservationApplications
                .Include(application => application.Submission)
                .Include(application => application.Estimate)
                .ThenInclude(estimate => estimate.Locations)
                .Include(application => application.SupportingDocuments)
                .SingleOrDefaultAsync(application => application.Id == request.WaterConservationApplicationId);

            dbApplication.Should().NotBeNull();
            dbApplication.Submission.Should().NotBeNull();

            // all properties on the request should be saved as a Submission record, excluding a couple which are found on the parent Application.
            dbApplication.Submission.Should().BeEquivalentTo(request, options => options
                .Excluding(submission => submission.WaterConservationApplicationId)
                .Excluding(submission => submission.WaterRightNativeId)
                .Excluding(submission => submission.FieldDetails)
                .Excluding(submission => submission.SupportingDocuments));

            if (request.FieldDetails.Any())
            {
                foreach (var detail in request.FieldDetails)
                {
                    var dbEstimateLocation = dbApplication.Estimate.Locations
                        .SingleOrDefault(location => location.Id == detail.WaterConservationApplicationEstimateLocationId);
                    dbEstimateLocation.Should().NotBeNull();
                    dbEstimateLocation.Should().BeEquivalentTo(detail, options => options
                        .Excluding(location => location.WaterConservationApplicationEstimateLocationId));
                }
            }

            dbApplication.SupportingDocuments.Count.Should().Be(3);
            dbApplication.SupportingDocuments.Any((doc) => doc.BlobName == documents[0].BlobName);
            dbApplication.SupportingDocuments.Any((doc) => doc.BlobName == documents[1].BlobName);
            dbApplication.SupportingDocuments.Any((doc) => doc.BlobName == documents[2].BlobName);
            dbApplication.SupportingDocuments.All((doc) =>
                string.IsNullOrWhiteSpace(doc.BlobName) && string.IsNullOrWhiteSpace(doc.FileName) && string.IsNullOrWhiteSpace(doc.Description));

            // Should queue event message
            MessageBusUtilityMock.Verify(
                mock => mock.SendMessageAsync(
                    Queues.ConservationApplicationSubmitted,
                    It.IsAny<CLI.Requests.Conservation.WaterConservationApplicationSubmittedEvent>()),
                Times.Once);
        }
        else
        {
            response.Error.Should().NotBeNull();
            response.Error.GetType().Name.Should().Be(expectedErrorTypeName);

            var dbApplicationDocuments = _dbContext.WaterConservationApplicationDocuments
                .Where(docs => docs.WaterConservationApplicationId == request.WaterConservationApplicationId).ToArray();

            dbApplicationDocuments.Length.Should().Be(0);
        }
    }

    [TestMethod]
    public async Task Store_SubmitApplication_AsAnonymous_ShouldThrow()
    {
        // Arrange
        var request = new WaterConservationApplicationSubmissionRequestFaker()
            .RuleFor(req => req.WaterRightNativeId, () => "1234")
            .RuleFor(req => req.WaterConservationApplicationId, () => Guid.NewGuid())
            .Generate();

        UseAnonymousContext();

        // Act
        var response = await _applicationManager.Store<
            CLI.Requests.Conservation.WaterConservationApplicationSubmissionRequest,
            CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().NotBeNull();

        ContextUtilityMock.Verify(x => x.GetRequiredContext<UserContext>(), Times.Once);
    }

    [DataTestMethod]
    [DataRow(false, false, false, "", false, nameof(InternalError), DisplayName = "User is not logged in")]
    [DataRow(true, false, false, "", false, nameof(NotFoundError), DisplayName = "Application does not exist")]
    [DataRow(true, true, false, "", false, nameof(ValidationError), DisplayName = "Users are not permitted to edit an Application that is not in review")]
    [DataRow(true, true, true, "", false, nameof(ForbiddenError), DisplayName = "User does not belong to the correct organization")]
    [DataRow(true, true, true, Roles.TechnicalReviewer, true, "", DisplayName = "User has permission to edit an Application Submission")]
    public async Task Store_UpdateApplicationSubmission_Success(
        bool userIsLoggedIn,
        bool applicationExists,
        bool applicationIsInReview,
        string userOrgRole,
        bool shouldSucceed,
        string expectedErrorTypeName
    )
    {
        // Arrange
        // setup application
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);

        WaterConservationApplication application = null;
        WaterConservationApplicationEstimateLocation[] estimateLocations = [];

        if (applicationExists)
        {
            var applicationOwner = new UserFaker().Generate();

            application = new WaterConservationApplicationFaker(applicationOwner, organization).Generate();
            await _dbContext.WaterConservationApplications.AddAsync(application);

            // setup application related details
            var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
            await _dbContext.WaterConservationApplicationEstimates.AddAsync(estimate);

            estimateLocations = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate(1).ToArray();
            await _dbContext.WaterConservationApplicationEstimateLocations.AddRangeAsync(estimateLocations);

            var documents = new WaterConservationApplicationDocumentsFaker(application, applicationOwner).Generate(3).ToArray();
            await _dbContext.WaterConservationApplicationDocuments.AddRangeAsync(documents);

            var submission = new WaterConservationApplicationSubmissionFaker(application)
                .RuleFor(sub => sub.AcceptedDate, () => applicationIsInReview ? null : DateTimeOffset.UtcNow)
                .Generate();
            await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        }

        await _dbContext.SaveChangesAsync();

        if (userIsLoggedIn)
        {
            UseUserContext(new UserContext
            {
                UserId = user.Id,
                Roles = [],
                OrganizationRoles =
                [
                    new OrganizationRole
                    {
                        OrganizationId = organization.Id,
                        RoleNames = [userOrgRole]
                    }
                ],
                ExternalAuthId = ""
            });
        }
        else
        {
            UseAnonymousContext();
        }


        // Act
        var request = new WaterConservationApplicationSubmissionUpdateRequestFaker()
            .RuleFor(req => req.WaterConservationApplicationId, () => application?.Id ?? Guid.NewGuid())
            .RuleFor(req => req.FieldDetails, () => estimateLocations.Select(location => new CLI.ApplicationSubmissionFieldDetail
            {
                WaterConservationApplicationEstimateLocationId = location.Id,
                AdditionalDetails = "Some additional details"
            }).ToArray())
            .RuleFor(req => req.SupportingDocuments, () =>
            [
                new CLI.Requests.Conservation.WaterConservationApplicationDocument
                {
                    BlobName = "blobname",
                    FileName = "filename.pdf",
                    Description = "description",
                }
            ])
            .Generate();

        var response = await _applicationManager.Store<
            CLI.Requests.Conservation.WaterConservationApplicationSubmissionUpdateRequest,
            CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Should().NotBeNull();

        if (shouldSucceed)
        {
            response.Error.Should().BeNull();

            // verify all db entries exist
            var dbApplication = await _dbContext.WaterConservationApplications
                .Include(a => a.Submission).ThenInclude(s => s.SubmissionNotes)
                .Include(a => a.Estimate).ThenInclude(e => e.Locations)
                .Include(a => a.SupportingDocuments)
                .Where(a => a.Id == request.WaterConservationApplicationId)
                .SingleOrDefaultAsync();

            dbApplication.Should().NotBeNull();
            dbApplication.Submission.Should().NotBeNull();
            dbApplication.Submission.SubmissionNotes.Should().HaveCount(1); // was created in the update
            dbApplication.Estimate.Should().NotBeNull();
            dbApplication.Estimate.Locations.Should().HaveCount(1);
            dbApplication.SupportingDocuments.Should().HaveCount(1); // other documents were removed in the update

            // verify entries were updated correctly
            dbApplication.Submission.Should().BeEquivalentTo(request, options => options.ExcludingMissingMembers());
            dbApplication.Estimate.Locations.First().Should()
                .BeEquivalentTo(request.FieldDetails.First(), options => options.ExcludingMissingMembers());

            // verify the supporting document is correct
            dbApplication.SupportingDocuments.First().Should().BeEquivalentTo(request.SupportingDocuments.First(), options => options
                // these fields are not defined on the request object
                .Excluding(doc => doc.Id)
                .Excluding(doc => doc.WaterConservationApplicationId)
                .ExcludingMissingMembers());

            // verify the submission note is correct
            var dbSubmissionNote = dbApplication.Submission.SubmissionNotes.First();
            dbSubmissionNote.Note.Should().Be(request.Note);
            dbSubmissionNote.UserId.Should().Be(user.Id);
            dbSubmissionNote.WaterConservationApplicationSubmissionId.Should().Be(dbApplication.Submission.Id);
        }
        else
        {
            response.Error.GetType().Name.Should().Be(expectedErrorTypeName);
        }
    }

    [DataTestMethod]
    [DataRow(Roles.Member, true, DisplayName = "A Member of the same Funding Organization should not be able to submit a recommendation")]
    [DataRow(Roles.TechnicalReviewer, false, DisplayName = "A Technical Reviewer of a different Funding Organization should not be able to submit a recommendation")]
    [DataRow(Roles.OrganizationAdmin, false, DisplayName = "An Organization Admin of a different Funding Organization should not be able to submit a recommendation")]
    public async Task Store_SubmitApplicationRecommendation_InvalidPermissions_ShouldThrow(string role, bool isPartOfOrg)
    {
        // Arrange
        // create an organization
        // create an application & submission in review status
        // create the request object
        // use a usercontext (use params)

        // Act
        
        // Assert
        // error should exist
        // error should be type ForbiddenError
    }
    
    [DataTestMethod]
    [DataRow(true, Roles.TechnicalReviewer, DisplayName = "Application is successfully Recommended for approval by a Technical Reviewer")]
    [DataRow(false, Roles.OrganizationAdmin, DisplayName = "Application is successfully Not Recommended for approval by an Organization Admin")]
    public async Task Store_SubmitApplicationRecommendation_Success(bool isRecommended, string role)
    {
        // Arrange
        // create an organization
        // create an application & submission in review status
        // create the request object
        // use a usercontext (role from params, same organization)
        
        // Act
        
        // Assert
        // no errors
        // application has the right date (recommendedfor date, recommendedagainst date)
        // application's other date is null
        // application has the reviewer's userid
        // application notes have been saved off
    }
    
    [TestMethod]
    public async Task OnApplicationSubmitted_WaterConservationApplication_ShouldSendEmail()
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var fundingOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, fundingOrganization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        UseSystemContext();

        // Act
        var result = await _applicationManager.OnApplicationSubmitted<WaterConservationApplicationSubmittedEvent, EventResponseBase>(new WaterConservationApplicationSubmittedEvent
        {
            ApplicationId = application.Id,
        });

        // Assert
        result.Error.Should().BeNull();

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == waterUser.Email &&
                    req.Subject == "Water Conservation Application Submitted" &&
                    req.Body.Contains(application.Id.ToString())
                )
            ),
            Times.Once
        );
    }
}