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

        var approvedApp = new WaterConservationApplicationSubmissionFaker(appOne)
            .RuleFor(app => app.ApprovedDate, _ => DateTimeOffset.Now).Generate();
        var deniedApp = new WaterConservationApplicationSubmissionFaker(appTwo)
            .RuleFor(app => app.DeniedDate, _ => DateTimeOffset.Now).Generate();
        var inReviewApp = new WaterConservationApplicationSubmissionFaker(appFour).Generate();

        await _dbContext.Organizations.AddRangeAsync(orgOne, orgTwo, orgThree);
        await _dbContext.Users.AddRangeAsync(userOne, userTwo, userThree);
        await _dbContext.WaterConservationApplications.AddRangeAsync(appOne, appTwo, appThree, appFour);
        await _dbContext.WaterConservationApplicationEstimates.AddRangeAsync(acceptedEstimate, rejectedEstimate, inReviewEstimate);
        await _dbContext.WaterConservationApplicationSubmissions.AddRangeAsync(approvedApp, deniedApp, inReviewApp);
        await _dbContext.SaveChangesAsync();

        var approvedAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appOne.Id,
            ApplicationDisplayId = appOne.ApplicationDisplayId,
            ApplicantFullName = $"{userOne.UserProfile.FirstName} {userOne.UserProfile.LastName}",
            CompensationRateDollars = acceptedEstimate.CompensationRateDollars,
            CompensationRateUnits = acceptedEstimate.CompensationRateUnits,
            OrganizationName = orgOne.Name,
            Status = ConservationApplicationStatus.Approved,
            SubmittedDate = approvedApp.SubmittedDate,
            WaterRightNativeId = appOne.WaterRightNativeId,
            WaterRightState = approvedApp.WaterRightState,
            TotalObligationDollars = acceptedEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = acceptedEstimate.CumulativeTotalEtInAcreFeet
        };

        var deniedAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appTwo.Id,
            ApplicationDisplayId = appTwo.ApplicationDisplayId,
            ApplicantFullName = $"{userTwo.UserProfile.FirstName} {userTwo.UserProfile.LastName}",
            CompensationRateDollars = rejectedEstimate.CompensationRateDollars,
            CompensationRateUnits = rejectedEstimate.CompensationRateUnits,
            OrganizationName = orgTwo.Name,
            Status = ConservationApplicationStatus.Denied,
            SubmittedDate = deniedApp.SubmittedDate,
            WaterRightNativeId = appTwo.WaterRightNativeId,
            WaterRightState = deniedApp.WaterRightState,
            TotalObligationDollars = rejectedEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = rejectedEstimate.CumulativeTotalEtInAcreFeet
        };

        var inReviewAppResponse = new ApplicationDashboardListItem
        {
            ApplicationId = appFour.Id,
            ApplicationDisplayId = appFour.ApplicationDisplayId,
            ApplicantFullName = $"{userOne.UserProfile.FirstName} {userOne.UserProfile.LastName}",
            CompensationRateDollars = inReviewEstimate.CompensationRateDollars,
            CompensationRateUnits = inReviewEstimate.CompensationRateUnits,
            OrganizationName = orgOne.Name,
            Status = ConservationApplicationStatus.InTechnicalReview,
            SubmittedDate = inReviewApp.SubmittedDate,
            WaterRightNativeId = appFour.WaterRightNativeId,
            WaterRightState = inReviewApp.WaterRightState,
            TotalObligationDollars = inReviewEstimate.EstimatedCompensationDollars,
            TotalWaterVolumeSavingsAcreFeet = inReviewEstimate.CumulativeTotalEtInAcreFeet
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

        var expectedApplications = new List<ApplicationDashboardListItem> { approvedAppResponse, inReviewAppResponse };

        if (isGlobalUser)
        {
            expectedApplications = expectedApplications.Append(deniedAppResponse).ToList();
        }

        response.Should().BeEquivalentTo(new OrganizationApplicationDashboardLoadResponse
        {
            Applications = expectedApplications.OrderByDescending(x => x.SubmittedDate).ToArray(),
        });
    }

    [TestMethod]
    public async Task Load_OrganizationApplicationDashboardRequest_ShouldHaveEachStatus()
    {
        // Arrange
        var applicant = new UserFaker().Generate();
        var admin = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();

        var submittedApplication = new WaterConservationApplicationFaker(applicant, organization)
            .RuleFor(a => a.Estimate, _ => new WaterConservationApplicationEstimateFaker()).Generate();
        var recommendedApplication = new WaterConservationApplicationFaker(applicant, organization)
            .RuleFor(a => a.Estimate, _ => new WaterConservationApplicationEstimateFaker()).Generate();
        var approvedApplication = new WaterConservationApplicationFaker(applicant, organization)
            .RuleFor(a => a.Estimate, _ => new WaterConservationApplicationEstimateFaker()).Generate();
        var rejectedApplication = new WaterConservationApplicationFaker(applicant, organization)
            .RuleFor(a => a.Estimate, _ => new WaterConservationApplicationEstimateFaker()).Generate();

        var submittedSubmission = new WaterConservationApplicationSubmissionFaker(submittedApplication).Generate();

        var recommendedSubmission = new WaterConservationApplicationSubmissionFaker(recommendedApplication)
            .RuleFor(sub => sub.RecommendedByUser, _ => admin)
            .RuleFor(sub => sub.RecommendedForDate, _ => DateTimeOffset.UtcNow)
            .Generate();

        var approvedSubmission = new WaterConservationApplicationSubmissionFaker(approvedApplication)
            .RuleFor(sub => sub.RecommendedByUser, _ => admin)
            .RuleFor(sub => sub.RecommendedForDate, _ => DateTimeOffset.UtcNow)
            .RuleFor(sub => sub.ApprovedByUser, _ => admin)
            .RuleFor(sub => sub.ApprovedDate, _ => DateTimeOffset.UtcNow)
            .Generate();

        var rejectedSubmission = new WaterConservationApplicationSubmissionFaker(rejectedApplication)
            .RuleFor(sub => sub.RecommendedByUser, _ => admin)
            .RuleFor(sub => sub.RecommendedForDate, _ => DateTimeOffset.UtcNow)
            .RuleFor(sub => sub.ApprovedByUser, _ => admin)
            .RuleFor(sub => sub.DeniedDate, _ => DateTimeOffset.UtcNow)
            .Generate();

        _dbContext.Organizations.Add(organization);
        _dbContext.Users.AddRange(applicant, admin);
        _dbContext.WaterConservationApplications.AddRange(submittedApplication, recommendedApplication, approvedApplication, rejectedApplication);
        _dbContext.WaterConservationApplicationSubmissions.AddRange(submittedSubmission, recommendedSubmission, approvedSubmission, rejectedSubmission);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = applicant.Id,
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act
        var response = await _applicationManager.Load<OrganizationApplicationDashboardLoadRequest, OrganizationApplicationDashboardLoadResponse>(
            new OrganizationApplicationDashboardLoadRequest());

        // Assert
        response.Error.Should().BeNull();

        response.Applications.Should().HaveCount(4);
        response.Applications.Should().ContainSingle(app => app.Status == ConservationApplicationStatus.InTechnicalReview);
        response.Applications.Should().ContainSingle(app => app.Status == ConservationApplicationStatus.InFinalReview);
        response.Applications.Should().ContainSingle(app => app.Status == ConservationApplicationStatus.Approved);
        response.Applications.Should().ContainSingle(app => app.Status == ConservationApplicationStatus.Denied);
    }

    [TestMethod]
    public async Task Load_ReviewerConservationApplicationLoadRequest_MultipleRequestTypes_Success()
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
            var locationWaterMeasurements = new LocationWaterMeasurementFaker(location).Generate(2);
            await _dbContext.LocationWaterMeasurements.AddRangeAsync(locationWaterMeasurements);
        }

        var controlLocation = new WaterConservationApplicationEstimateControlLocationFaker(estimate).Generate();
        await _dbContext.WaterConservationApplicationEstimateControlLocations.AddAsync(controlLocation);

        var controlLocationWaterMeasurements = new ControlLocationWaterMeasurementFaker(controlLocation).Generate(2);
        await _dbContext.ControlLocationWaterMeasurements.AddRangeAsync(controlLocationWaterMeasurements);

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
        applicantResponse.Application.Estimate.Locations.SelectMany(l => l.WaterMeasurements).Should()
            .BeEquivalentTo(locations.SelectMany(l => l.WaterMeasurements), options => options.ExcludingMissingMembers());
        applicantResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        applicantResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());

        // although an applicant cannot create a control location, if one exists then it should be included in the response
        applicantResponse.Application.Estimate.ControlLocation.Should().BeEquivalentTo(controlLocation, options => options.ExcludingMissingMembers());
        applicantResponse.Application.Estimate.ControlLocation.WaterMeasurements.Should()
            .BeEquivalentTo(controlLocationWaterMeasurements, options => options.ExcludingMissingMembers());

        reviewerResponse.Should().NotBeNull();
        reviewerResponse.Application.Should().BeEquivalentTo(application, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Should().BeEquivalentTo(estimate, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.Should().BeEquivalentTo(locations, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.SelectMany(l => l.WaterMeasurements).Should()
            .BeEquivalentTo(locations.SelectMany(l => l.WaterMeasurements), options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.ControlLocation.Should().BeEquivalentTo(controlLocation, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.ControlLocation.WaterMeasurements.Should()
            .BeEquivalentTo(controlLocationWaterMeasurements, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());
        reviewerResponse.Notes.Should().BeEquivalentTo(notes, options => options.ExcludingMissingMembers());

        // sanity checks: these should all be covered by the `BeEquivalentTo` comparisons, but we're performing them just in case

        // verify that new fields are included in response
        reviewerResponse.Application.Estimate.Locations.All(loc =>
            loc.WaterMeasurements.All(cu => cu.EffectivePrecipitationInInches != null && cu.NetEtInInches != null)
        ).Should().BeTrue();

        applicantResponse.Application.Estimate.CumulativeNetEtInAcreFeet.Should().NotBeNull();
        applicantResponse.Application.Estimate.CumulativeNetEtInAcreFeet.Should().Be(estimate.CumulativeNetEtInAcreFeet);

        reviewerResponse.Application.Estimate.CumulativeNetEtInAcreFeet.Should().NotBeNull();
        reviewerResponse.Application.Estimate.CumulativeNetEtInAcreFeet.Should().Be(estimate.CumulativeNetEtInAcreFeet);

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

    [TestMethod]
    public async Task Load_ReviewerConservationApplicationLoadRequest_RecentlySubmittedApplication_ShouldHaveCorrectPipelineSteps()
    {
        // Arrange
        var submission = SetupApplicationSubmission();

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act
        var response = await _applicationManager.Load<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>(
            new ReviewerConservationApplicationLoadRequest
            {
                ApplicationId = submission.WaterConservationApplicationId
            });

        // Assert
        response.Error.Should().BeNull();
        response.Application.ReviewPipeline.ReviewSteps.Should().HaveCount(1);

        var submittedStep = response.Application.ReviewPipeline.ReviewSteps[0];
        var applicantProfile = submission.WaterConservationApplication.ApplicantUser.UserProfile;
        submittedStep.ParticipantName.Should().Be($"{applicantProfile.FirstName} {applicantProfile.LastName}");
        submittedStep.ReviewStepType.Should().Be(ReviewStepType.ApplicantSubmitted);
        submittedStep.ReviewStepStatus.Should().Be(ReviewStepStatus.Submitted);
        submittedStep.ReviewDate.Should().Be(submission.SubmittedDate);
    }

    [TestMethod]
    public async Task Load_ReviewerConservationApplicationLoadRequest_RecentlyRecommendedApplication_ShouldHaveCorrectPipelineSteps()
    {
        // Arrange
        var submission = SetupApplicationSubmission();

        var recommender = new UserFaker().Generate();
        submission.RecommendedByUser = recommender;
        submission.RecommendedForDate = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act
        var response = await _applicationManager.Load<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>(
            new ReviewerConservationApplicationLoadRequest
            {
                ApplicationId = submission.WaterConservationApplicationId
            });

        // Assert
        response.Error.Should().BeNull();
        response.Application.ReviewPipeline.ReviewSteps.Should().HaveCount(2);

        var recommendationStep = response.Application.ReviewPipeline.ReviewSteps[1];
        recommendationStep.ReviewStepType.Should().Be(ReviewStepType.Recommendation);
        recommendationStep.ReviewStepStatus.Should().Be(ReviewStepStatus.RecommendedForApproval);
        recommendationStep.ParticipantName.Should().Be($"{recommender.UserProfile.FirstName} {recommender.UserProfile.LastName}");
        recommendationStep.ReviewDate.Should().Be(submission.RecommendedForDate);
    }

    [TestMethod]
    public async Task Load_ReviewerConservationApplicationLoadRequest_RecentlyApprovedApplication_ShouldHaveCorrectPipelineSteps()
    {
        // Arrange
        var submission = SetupApplicationSubmission();

        var recommender = new UserFaker().Generate();
        var approver = new UserFaker().Generate();

        submission.RecommendedByUser = recommender;
        submission.RecommendedForDate = DateTimeOffset.UtcNow;
        submission.ApprovedByUser = approver;
        submission.ApprovedDate = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = Guid.NewGuid(),
            Roles = [Roles.GlobalAdmin],
            OrganizationRoles = [],
            ExternalAuthId = ""
        });

        // Act
        var response = await _applicationManager.Load<ReviewerConservationApplicationLoadRequest, ReviewerConservationApplicationLoadResponse>(
            new ReviewerConservationApplicationLoadRequest
            {
                ApplicationId = submission.WaterConservationApplicationId
            });

        // Assert
        response.Error.Should().BeNull();
        response.Application.ReviewPipeline.ReviewSteps.Should().HaveCount(3);

        var approvalStep = response.Application.ReviewPipeline.ReviewSteps[2];
        approvalStep.ReviewStepType.Should().Be(ReviewStepType.Approval);
        approvalStep.ReviewStepStatus.Should().Be(ReviewStepStatus.Approved);
        approvalStep.ParticipantName.Should().Be($"{approver.UserProfile.FirstName} {approver.UserProfile.LastName}");
        approvalStep.ReviewDate.Should().Be(submission.ApprovedDate);
    }

    [DataTestMethod]
    [DataRow(false, true, DisplayName = "Create new estimate")]
    [DataRow(true, true, DisplayName = "Overwrite existing estimate")]
    [DataRow(false, false, DisplayName = "Request without compensation should not save estimate")]
    public async Task Store_ApplicantEstimateConsumptiveUse_AsUser_Success(
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
        // run prior to test initialization in case previous run failed
        await ClearDatabases(wadeDb, _dbContext);

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
                var estimateLocationConsumptiveUses = new LocationWaterMeasurementFaker(estimateLocation).Generate(12);

                await _dbContext.LocationWaterMeasurements.AddRangeAsync(estimateLocationConsumptiveUses);
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
                            return Enumerable.Range(0, monthsInYear).Select(_ => new Common.DataContracts.RasterTimeSeriesDatapoint
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
            var request = new ApplicantEstimateConsumptiveUseRequest
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
                ApplicantEstimateConsumptiveUseRequest,
                ApplicantEstimateConsumptiveUseResponse>(
                request);


            // Assert
            response.Should().NotBeNull();
            response.Error.Should().BeNull();


            // verify response calculations are correct
            const int knownAvgYearlyTotalEtInInches = 60;
            var knownAvgYearlyEtFeet = knownAvgYearlyTotalEtInInches / 12;
            var expectedAvgYearlyEtAcreFeet = knownAvgYearlyEtFeet * memorialStadiumApproximateAreaInAcres;
            response.CumulativeTotalEtInAcreFeet.Should().BeApproximately(expectedAvgYearlyEtAcreFeet, 0.01);

            if (requestShouldIncludeCompensationInfo)
            {
                var expectedConservationPayment = requestedCompensationPerAcreFoot * response.CumulativeTotalEtInAcreFeet;
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
                .ThenInclude(location => location.WaterMeasurements)
                .SingleOrDefaultAsync(estimate => estimate.WaterConservationApplicationId == application.Id);
            var dbEstimateLocation = dbEstimate?.Locations.First();
            var dbEstimateLocationConsumptiveUses = dbEstimateLocation?.WaterMeasurements;

            if (requestShouldIncludeCompensationInfo)
            {
                // verify db entries were created successfully
                dbEstimate.Should().NotBeNull();
                dbEstimate.Locations.Should().HaveCount(1); // 1 polygon
                dbEstimate.Locations.First().WaterMeasurements.Should().HaveCount(yearRange); // monthly datapoints are grouped by year

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
                dbEstimate.CumulativeTotalEtInAcreFeet.Should().BeApproximately(expectedAvgYearlyEtAcreFeet, 0.01);

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
                dbEstimateLocationConsumptiveUses.Select(cu => cu.TotalEtInInches).Sum().Should().Be(knownAvgYearlyTotalEtInInches);

                if (shouldInitializePreviousEstimate)
                {
                    // verify db entries were overwritten successfully
                    dbEstimate.Id.Should().NotBe(estimate.Id);

                    dbEstimateLocation.Id.Should().NotBe(estimate.Locations.First().Id);

                    var previousConsumptiveUsesIds = estimate.Locations.First().WaterMeasurements.Select(cu => cu.Id).ToHashSet();
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
            await ClearDatabases(wadeDb, _dbContext);
        }
    }

    [TestMethod]
    public async Task Store_ApplicantEstimateConsumptiveUse_AsAnonymous_Failure()
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
                    new Common.DataContracts.RasterTimeSeriesDatapoint
                    {
                        Time = DateOnly.FromDateTime(new DateTime(startYear, 1, 1)),
                        Evapotranspiration = 5,
                    }
                ]
            });

        ContextUtilityMock.Setup(x => x.GetRequiredContext<UserContext>())
            .Throws(new InvalidOperationException("User context is required for this operation"));

        UseAnonymousContext();

        var request = new ApplicantEstimateConsumptiveUseRequest
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
            ApplicantEstimateConsumptiveUseRequest,
            ApplicantEstimateConsumptiveUseResponse>(
            request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().NotBeNull();

        ContextUtilityMock.Verify(x => x.GetRequiredContext<UserContext>(), Times.Once);
    }

    [DataTestMethod]
    [DataRow(false)]
    [DataRow(true)]
    public async Task Store_ReviewerEstimateConsumptiveUse_AsUser_Success(bool shouldUpdateApplicantsEstimate)
    {
        // perform db setup in custom transaction scope to avoid implicit distributed transactions error
        using var transactionScope = new TransactionScope(TransactionScopeOption.Suppress, new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
        }, TransactionScopeAsyncFlowOption.Enabled);

        var wadeDb = Services.GetRequiredService<IDatabaseContextFactory>().Create();

        // necessary since we're using a custom transaction scope
        // run prior to test initialization in case previous run failed
        await ClearDatabases(wadeDb, _dbContext);

        try
        {
            // Arrange
            const int monthsInYear = 12;
            const int startYear = 2015;
            const int yearRange = 10;

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

            var estimate = new WaterConservationApplicationEstimateFaker(application)
                .RuleFor(est => est.CompensationRateUnits, () => CompensationRateUnits.AcreFeet)
                .GenerateMetadataFromOrganization(organization)
                .Generate();
            var estimateLocation = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate();

            var estimateLocationConsumptiveUses = Enumerable.Range(0, yearRange)
                .Select(yearOffset =>
                    new LocationWaterMeasurementFaker(estimateLocation)
                        .RuleFor(measurement => measurement.Year, () => startYear + yearOffset) // 2015 - 2024
                        .Generate()
                )
                .ToArray();
            await _dbContext.LocationWaterMeasurements.AddRangeAsync(estimateLocationConsumptiveUses);

            var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
            await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);

            await _dbContext.SaveChangesAsync();

            OpenEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<Common.DataContracts.RasterTimeSeriesPolygonRequest>()))
                .ReturnsAsync(new Common.DataContracts.RasterTimeSeriesPolygonResponse
                {
                    Data = Enumerable.Range(0, yearRange).Select(yearOffset =>
                        {
                            var time = DateOnly.FromDateTime(new DateTime(startYear + yearOffset, 1, 1));
                            return Enumerable.Range(0, monthsInYear).Select(_ => new Common.DataContracts.RasterTimeSeriesDatapoint
                            {
                                Time = time,
                                Evapotranspiration = 5, // 5in/month = 60in/year = 5ft/year
                            });
                        })
                        .SelectMany(monthlyData => monthlyData)
                        .ToArray()
                });

            OpenEtSdkMock.Setup(x => x.RasterTimeseriesPoint(It.IsAny<Common.DataContracts.RasterTimeSeriesPointRequest>()))
                .ReturnsAsync(new Common.DataContracts.RasterTimeSeriesPointResponse
                {
                    Data = Enumerable.Range(0, yearRange).Select(yearOffset =>
                        {
                            var time = DateOnly.FromDateTime(new DateTime(startYear + yearOffset, 1, 1));
                            return Enumerable.Range(0, monthsInYear).Select(_ => new Common.DataContracts.RasterTimeSeriesDatapoint
                            {
                                Time = time,
                                Evapotranspiration = 1, // 1in/month, 1ft/year
                            });
                        })
                        .SelectMany(monthlyData => monthlyData)
                        .ToArray()
                });


            UseUserContext(new UserContext
            {
                UserId = user.Id,
                Roles = [],
                OrganizationRoles =
                [
                    new OrganizationRole()
                    {
                        OrganizationId = organization.Id,
                        RoleNames = [Roles.TechnicalReviewer],
                    }
                ],
                ExternalAuthId = ""
            });

            var request = new ReviewerEstimateConsumptiveUseRequest
            {
                WaterConservationApplicationId = application.Id,
                UpdateEstimate = shouldUpdateApplicantsEstimate,
                Polygons =
                [
                    new CLI.MapPolygon
                    {
                        // null Id -> the existing location will be deleted, and a new location will be created for this polygon
                        WaterConservationApplicationEstimateLocationId = null,
                        PolygonWkt = memorialStadiumFootballField,
                        DrawToolType = DrawToolType.Freeform,
                    }
                ],
                ControlLocation = new CLI.MapPoint
                {
                    PointWkt = "POINT (0 0)",
                },
            };

            // Act
            var response = await _applicationManager.Store<
                ReviewerEstimateConsumptiveUseRequest,
                ReviewerEstimateConsumptiveUseResponse>(
                request);


            // Assert
            response.Should().NotBeNull();
            response.Error.Should().BeNull();


            // verify response calculations are correct:
            // - verify Total ET
            const int locationsCumulativeTotalEtInInches = 60;
            var locationsCumulativeTotalEtInFeet = locationsCumulativeTotalEtInInches / 12;
            var expectedLocationsCumulativeTotalEtInAcreFeet = locationsCumulativeTotalEtInFeet * memorialStadiumApproximateAreaInAcres;
            response.CumulativeTotalEtInAcreFeet.Should().BeApproximately(expectedLocationsCumulativeTotalEtInAcreFeet, 0.01);

            // - verify Net ET
            const int controlCumulativeTotalEtInInches = 12;
            var locationsCumulativeNetEtInInches = locationsCumulativeTotalEtInInches - controlCumulativeTotalEtInInches;
            var locationsCumulativeNetEtInFeet = locationsCumulativeNetEtInInches / 12;
            var expectedLocationsCumulativeNetEtInAcreFeet = locationsCumulativeNetEtInFeet * memorialStadiumApproximateAreaInAcres;
            response.CumulativeNetEtInAcreFeet.Should().BeApproximately(expectedLocationsCumulativeNetEtInAcreFeet, 0.01);

            // - verify payment reuses original estimate's desired compensation dollars
            // - verify payment calculates using Net ET instead of Total ET
            var expectedConservationPayment = estimate.CompensationRateDollars * response.CumulativeNetEtInAcreFeet;
            response.ConservationPayment.Should().Be((int)expectedConservationPayment);

            var dbEstimate = await _dbContext.WaterConservationApplicationEstimates
                .Include(estimate => estimate.Locations).ThenInclude(location => location.WaterMeasurements)
                .Include(estimate => estimate.ControlLocations).ThenInclude(cLocation => cLocation.WaterMeasurements)
                .SingleOrDefaultAsync(estimate => estimate.WaterConservationApplicationId == application.Id);
            var dbEstimateLocation = dbEstimate?.Locations.First();
            var dbEstimateLocationWaterMeasurements = dbEstimateLocation?.WaterMeasurements;
            var dbEstimateControlLocation = dbEstimate?.ControlLocations?.FirstOrDefault();
            var dbEstimateControlLocationWaterMeasurements = dbEstimateControlLocation?.WaterMeasurements;

            // estimate should always exist; it was either:
            // * created by the applicant
            // * overwritten by the technical reviewer
            dbEstimate.Should().NotBeNull();
            dbEstimate.Locations.Should().HaveCount(1); // 1 polygon
            dbEstimate.Locations.First().WaterMeasurements.Should().HaveCount(yearRange);

            // verify db fields all match expectations
            dbEstimate.WaterConservationApplicationId.Should().Be(application.Id);


            // sanity check - these values are populated via the faker extension `GenerateMetadataFromOrganization`
            //   (they may be set in the call chain too if `UpdateEstimate == true`,
            //   but they should be set to the same values they already have because of the faker)
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

            // desired dollars/units should not be modified from the original estimate
            dbEstimate.CompensationRateDollars.Should().Be(estimate.CompensationRateDollars);
            dbEstimate.CompensationRateUnits.Should().Be(estimate.CompensationRateUnits);

            if (shouldUpdateApplicantsEstimate)
            {
                // these values are not generated by the faker, so they are only populated on the Estimate
                // if the Estimate is overwritten.
                dbEstimate.CumulativeTotalEtInAcreFeet.Should().BeApproximately(expectedLocationsCumulativeTotalEtInAcreFeet, 0.01);
                dbEstimate.CumulativeNetEtInAcreFeet.Should().BeApproximately(expectedLocationsCumulativeNetEtInAcreFeet, 0.01);


                // these remaining values are randomly generated, so the Estimate only matches
                // if the Estimate is overwritten.
                dbEstimateLocation.PolygonWkt.Should().Be(request.Polygons[0].PolygonWkt);
                dbEstimateLocation.DrawToolType.Should().Be(request.Polygons[0].DrawToolType);
                dbEstimateLocation.PolygonAreaInAcres.Should().BeApproximately(memorialStadiumApproximateAreaInAcres, 0.01);

                // double-check that the response data was cross-referenced successfully with the db EstimateLocations and EstimateControlLocation
                response.DataCollections.First().WaterConservationApplicationEstimateLocationId.Should().Be(dbEstimateLocation.Id);
                response.ControlDataCollection.WaterConservationApplicationEstimateControlLocationId.Should().Be(dbEstimateControlLocation.Id);

                // verify that the dates are all in the correct range
                dbEstimateLocationWaterMeasurements.All(waterMeasurement =>
                {
                    var yearMatches = startYear <= waterMeasurement.Year && waterMeasurement.Year < startYear + yearRange;
                    return yearMatches;
                }).Should().BeTrue();

                dbEstimate.ControlLocations.Single().WaterMeasurements.All(measurement =>
                        startYear <= measurement.Year && measurement.Year < startYear + yearRange)
                    .Should().BeTrue();
            }


            var previousConsumptiveUsesIds = estimate.Locations.First().WaterMeasurements.Select(cu => cu.Id).ToHashSet();

            // estimate should be the same regardless of an update
            dbEstimate.Id.Should().Be(estimate.Id);

            if (shouldUpdateApplicantsEstimate)
            {
                // conservation payment was updated to reflect changed polygons
                dbEstimate.EstimatedCompensationDollars.Should().Be(response.ConservationPayment);

                // we did not provide the location id in our request,
                // so the location should have been overwritten (deleted and recreated)
                dbEstimateLocation.Id.Should().NotBe(estimate.Locations.First().Id);

                // water measurements were overwritten
                dbEstimateLocationWaterMeasurements.All(cu => previousConsumptiveUsesIds.Contains(cu.Id))
                    .Should().BeFalse();

                // control location and its water measurements were created
                dbEstimateControlLocation.Should().NotBeNull();
                dbEstimateControlLocationWaterMeasurements.Should().NotBeNullOrEmpty();
            }
            else
            {
                // conservation payment remains unchanged
                dbEstimate.EstimatedCompensationDollars.Should().Be(estimate.EstimatedCompensationDollars);

                // locations remain unchanged
                dbEstimateLocation.Id.Should().Be(estimate.Locations.First().Id);

                // water measurements remain unchanged
                dbEstimateLocationWaterMeasurements.All(cu => previousConsumptiveUsesIds.Contains(cu.Id))
                    .Should().BeTrue();

                // control location and its water measurements were not created
                dbEstimateControlLocation.Should().BeNull();
                dbEstimateControlLocationWaterMeasurements.Should().BeNull();
            }
        }
        finally
        {
            // cleanup after test finishes to prevent issues with other tests
            await ClearDatabases(wadeDb, _dbContext);
        }
    }

    [TestMethod]
    public async Task Store_ReviewerEstimateConsumptiveUse_AsAnonymous_Failure()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);

        await _dbContext.SaveChangesAsync();

        const int startYear = 2024;
        OpenEtSdkMock.Setup(x => x.RasterTimeseriesPolygon(It.IsAny<RasterTimeSeriesPolygonRequest>()))
            .ReturnsAsync(new RasterTimeSeriesPolygonResponse
            {
                Data =
                [
                    new RasterTimeSeriesDatapoint
                    {
                        Time = DateOnly.FromDateTime(new DateTime(startYear, 1, 1)),
                        Evapotranspiration = 5,
                    }
                ]
            });

        ContextUtilityMock.Setup(x => x.GetRequiredContext<UserContext>())
            .Throws(new InvalidOperationException("User context is required for this operation"));

        UseAnonymousContext();

        var request = new ReviewerEstimateConsumptiveUseRequest
        {
            WaterConservationApplicationId = application.Id,
            UpdateEstimate = false,
            Polygons =
            [
                new CLI.MapPolygon
                {
                    PolygonWkt = memorialStadiumFootballField,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
            ControlLocation = new CLI.MapPoint
            {
                PointWkt = "POINT (0 0)",
            }
        };

        // Act
        var response = await _applicationManager.Store<
            ReviewerEstimateConsumptiveUseRequest,
            ReviewerEstimateConsumptiveUseResponse>(
            request);

        // Assert
        response.Should().NotBeNull();
        response.Error.Should().NotBeNull();

        ContextUtilityMock.Verify(x => x.GetRequiredContext<UserContext>(), Times.Once);
    }

    [TestMethod]
    public async Task Store_ReviewerEstimateConsumptiveUse_AttemptsToUpdateEstimateLocationWhichDoesNotExist_Failure()
    {
        // Arrange
        const int yearRange = 10;

        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker()
            .RuleFor(org => org.OpenEtDateRangeInYears, () => yearRange)
            .Generate();
        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.SaveChangesAsync();

        var application = new WaterConservationApplicationFaker()
            .RuleFor(a => a.ApplicantUserId, () => user.Id)
            .RuleFor(a => a.FundingOrganizationId, () => organization.Id)
            .Generate();

        await _dbContext.WaterConservationApplications.AddAsync(application);

        var estimate = new WaterConservationApplicationEstimateFaker(application)
            .RuleFor(est => est.CompensationRateUnits, () => CompensationRateUnits.AcreFeet)
            .GenerateMetadataFromOrganization(organization)
            .Generate();
        var estimateLocation = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate();

        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);

        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [],
            OrganizationRoles =
            [
                new OrganizationRole()
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.TechnicalReviewer],
                }
            ],
            ExternalAuthId = ""
        });

        var request = new ReviewerEstimateConsumptiveUseRequest
        {
            WaterConservationApplicationId = application.Id,
            UpdateEstimate = true,
            Polygons =
            [
                new CLI.MapPolygon
                {
                    // id is not null, but does not match an existing EstimateLocation -> Error
                    WaterConservationApplicationEstimateLocationId = Guid.NewGuid(),
                    PolygonWkt = memorialStadiumFootballField,
                    DrawToolType = DrawToolType.Freeform,
                }
            ],
            ControlLocation = new CLI.MapPoint
            {
                PointWkt = "POINT (0 0)",
            },
        };

        // Act
        var response = await _applicationManager.Store<
            ReviewerEstimateConsumptiveUseRequest,
            ReviewerEstimateConsumptiveUseResponse>(
            request);


        // Assert
        response.Should().NotBeNull();
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<NotFoundError>();
        response.Error.PublicMessage.Should().Contain($"EstimateLocations with Ids {request.Polygons[0].WaterConservationApplicationEstimateLocationId}");
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
                    Queues.ConservationApplicationStatusChanged,
                    It.Is<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase>(
                        // Check for derived event type
                        x => x is CLI.Requests.Conservation.WaterConservationApplicationSubmittedEvent
                    )),
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
                .RuleFor(sub => sub.ApprovedDate, () => applicationIsInReview ? null : DateTimeOffset.UtcNow)
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
            CLI.Responses.Conservation.WaterConservationApplicationSubmissionUpdateResponse>(request);

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

            // verify the returned note has all the required information
            response.Note.Note.Should().BeEquivalentTo(request.Note);
            response.Note.SubmittedDate.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromMinutes(1));
            response.Note.SubmittedByUserId.Should().Be(user.Id);
            response.Note.SubmittedByFullName.Should().Be($"{user.UserProfile.FirstName} {user.UserProfile.LastName}");
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
        var user = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(user, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
        await _dbContext.Users.AddAsync(user);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        UseUserContext(new UserContext
        {
            UserId = user.Id,
            Roles = [],
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = isPartOfOrg ? organization.Id : Guid.NewGuid(),
                    RoleNames = [role]
                }
            ],
            ExternalAuthId = ""
        });

        var request = new CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest
        {
            WaterConservationApplicationId = application.Id,
            RecommendationDecision = RecommendationDecision.For,
        };

        // Act
        var response = await _applicationManager
            .Store<CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest,
                CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ForbiddenError>();
    }

    [TestMethod]
    public async Task Store_SubmitApplicationRecommendation_MultipleTimes_Success()
    {
        // Arrange
        var organizationAdmin = new UserFaker().Generate();
        var technicalReviewer = new UserFaker().Generate();
        var waterUser = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
        await _dbContext.Users.AddRangeAsync(waterUser, technicalReviewer, organizationAdmin);
        await _dbContext.Organizations.AddAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        // Arrange 1 (Technical Reviewer - recommends for with no notes)
        UseUserContext(new UserContext
        {
            UserId = technicalReviewer.Id,
            Roles = [],
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.TechnicalReviewer]
                }
            ],
            ExternalAuthId = ""
        });

        var recommendForRequest = new CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest
        {
            WaterConservationApplicationId = application.Id,
            RecommendationDecision = RecommendationDecision.For
        };

        // Act 1
        var recommendForResponse =
            await _applicationManager.Store<CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(
                recommendForRequest);

        // Assert 1
        recommendForResponse.Error.Should().BeNull();

        var applicationSubmission = await _dbContext.WaterConservationApplicationSubmissions
            .AsNoTracking()
            .Include(sub => sub.SubmissionNotes)
            .SingleOrDefaultAsync(sub => sub.WaterConservationApplicationId == recommendForRequest.WaterConservationApplicationId);
        applicationSubmission.RecommendedByUserId.Should().Be(technicalReviewer.Id);
        applicationSubmission.RecommendedForDate.Should().NotBeNull();
        applicationSubmission.RecommendedAgainstDate.Should().BeNull();
        applicationSubmission.SubmissionNotes.Should().HaveCount(0);

        // Arrange 2 (Organization Admin - recommends against with a note)
        UseUserContext(new UserContext
        {
            UserId = organizationAdmin.Id,
            Roles = [],
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.OrganizationAdmin]
                }
            ],
            ExternalAuthId = ""
        });

        var recommendAgainstRequest = new CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest
        {
            WaterConservationApplicationId = application.Id,
            RecommendationDecision = RecommendationDecision.Against,
            RecommendationNotes = "Recommending against approving this application"
        };

        // Act 2
        var recommendAgainstResponse =
            await _applicationManager.Store<CLI.Requests.Conservation.WaterConservationApplicationRecommendationRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(
                recommendAgainstRequest);

        // Assert 2
        recommendAgainstResponse.Error.Should().BeNull();

        var applicationSubmission2 = await _dbContext.WaterConservationApplicationSubmissions
            .AsNoTracking()
            .Include(sub => sub.SubmissionNotes)
            .SingleOrDefaultAsync(sub => sub.WaterConservationApplicationId == recommendForRequest.WaterConservationApplicationId);
        applicationSubmission2.RecommendedByUserId.Should().Be(organizationAdmin.Id);
        applicationSubmission2.RecommendedForDate.Should().BeNull();
        applicationSubmission2.RecommendedAgainstDate.Should().NotBeNull();
        applicationSubmission2.SubmissionNotes.Should().HaveCount(1);

        MessageBusUtilityMock.Verify(mock =>
                mock.SendMessageAsync(
                    Queues.ConservationApplicationStatusChanged,
                    It.Is<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase>(
                        // Check for derived event type
                        x => x is CLI.Requests.Conservation.WaterConservationApplicationRecommendedEvent
                    )),
            Times.Exactly(2));
    }

    [DataTestMethod]
    [DataRow(Roles.Member, false, DisplayName = "A Member should not be able to approve a different funding organization's application")]
    [DataRow(Roles.OrganizationAdmin, false, DisplayName = "An Organization Admin should not be able to approve a different funding organization's application")]
    [DataRow(Roles.TechnicalReviewer, true, DisplayName = "A Technical Reviewer should not be able to approve their own funding organization's applications")]
    public async Task Store_SubmitApplicationApproval_InvalidPermissions_ShouldThrow(string role, bool isPartOfOrg)
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var technicalReviewerId = Guid.NewGuid();
        var technicalReviewer = new UserFaker()
            .RuleFor(user => user.Id, _ => technicalReviewerId).Generate();
        var approvalReviewer = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var diffOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application)
            .RuleFor(sub => sub.RecommendedForDate, _ => DateTimeOffset.Now)
            .RuleFor(sub => sub.RecommendedByUserId, _ => technicalReviewerId)
            .Generate();
        await _dbContext.Users.AddRangeAsync(waterUser, technicalReviewer, approvalReviewer);
        await _dbContext.Organizations.AddRangeAsync(organization, diffOrganization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        var request = new CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest
        {
            WaterConservationApplicationId = application.Id,
            ApprovalDecision = ApprovalDecision.Approved,
            ApprovalNotes = "This application is approved, way to go."
        };

        UseUserContext(new UserContext
        {
            Roles = [],
            ExternalAuthId = "",
            UserId = approvalReviewer.Id,
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = isPartOfOrg ? organization.Id : diffOrganization.Id,
                    RoleNames = [role]
                }
            ]
        });

        // Act
        var response = await _applicationManager
            .Store<CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ForbiddenError>();
        var applicationInDb = await _dbContext.WaterConservationApplications.Where(app => app.Id == request.WaterConservationApplicationId)
            .Include(app => app.Submission)
            .ThenInclude(sub => sub.SubmissionNotes)
            .SingleOrDefaultAsync();
        applicationInDb.Submission!.RecommendedForDate.Should().Be(submission.RecommendedForDate);
        applicationInDb.Submission!.RecommendedByUserId.Should().Be(submission.RecommendedByUserId);
        applicationInDb.Submission!.ApprovedDate.Should().BeNull();
        applicationInDb.Submission!.DeniedDate.Should().BeNull();
        applicationInDb.Submission!.ApprovedByUserId.Should().BeNull();
        applicationInDb.Submission!.SubmissionNotes.Should().HaveCount(0);
    }

    [TestMethod]
    public async Task Store_SubmitApplicationApproval_AppSubmissionDoesntExist_ShouldThrow()
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, organization).Generate();
        await _dbContext.Users.AddAsync(waterUser);
        await _dbContext.Organizations.AddRangeAsync(organization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.SaveChangesAsync();

        var request = new CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest
        {
            WaterConservationApplicationId = application.Id,
            ApprovalDecision = ApprovalDecision.Approved,
            ApprovalNotes = "Some notes with my approval"
        };

        UseUserContext(new UserContext
        {
            Roles = [],
            ExternalAuthId = "",
            UserId = Guid.NewGuid(),
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.Member]
                }
            ]
        });

        // Act
        var response = await _applicationManager
            .Store<CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<NotFoundError>();
    }

    [DataTestMethod]
    [DataRow(ConservationApplicationStatus.Unknown, DisplayName = "An application with an Unknown (invalid) status cannot be Approved or Denied")]
    [DataRow(ConservationApplicationStatus.InTechnicalReview, DisplayName = "An application that hasn't received a Recommendation yet cannot be Approved or Denied")]
    [DataRow(ConservationApplicationStatus.Approved, DisplayName = "An application that has already been Approved cannot be Approved or Denied")]
    [DataRow(ConservationApplicationStatus.Denied, DisplayName = "An application that has already been Denied cannot be Approved or Denied")]
    public async Task Store_SubmitApplicationApproval_InvalidApplicationStatus_ShouldThrow(ConservationApplicationStatus status)
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var technicalReviewerId = Guid.NewGuid();
        var technicalReviewer = new UserFaker()
            .RuleFor(user => user.Id, _ => technicalReviewerId).Generate();
        var approvalReviewerId = Guid.NewGuid();
        var approvalReviewer = new UserFaker()
            .RuleFor(user => user.Id, _ => approvalReviewerId).Generate();
        var organization = new OrganizationFaker().Generate();
        var diffOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        var oldTimestamp = DateTime.UtcNow.Subtract(TimeSpan.FromDays(1));

        switch (status)
        {
            case ConservationApplicationStatus.InTechnicalReview:
                submission.RecommendedForDate = null;
                submission.RecommendedByUserId = null;
                submission.ApprovedDate = null;
                submission.ApprovedByUserId = null;
                break;
            case ConservationApplicationStatus.Approved:
                submission.RecommendedForDate = oldTimestamp;
                submission.RecommendedByUserId = technicalReviewerId;
                submission.ApprovedDate = oldTimestamp;
                submission.ApprovedByUserId = approvalReviewerId;
                break;
            case ConservationApplicationStatus.Denied:
                submission.RecommendedForDate = oldTimestamp;
                submission.RecommendedByUserId = technicalReviewerId;
                submission.DeniedDate = oldTimestamp;
                submission.ApprovedByUserId = approvalReviewerId;
                break;
            case ConservationApplicationStatus.Unknown:
                submission.DeniedDate = oldTimestamp;
                submission.ApprovedDate = oldTimestamp;
                submission.ApprovedByUserId = approvalReviewerId;
                break;
        }

        await _dbContext.Users.AddRangeAsync(waterUser, technicalReviewer, approvalReviewer);
        await _dbContext.Organizations.AddRangeAsync(organization, diffOrganization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        var request = new CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest
        {
            WaterConservationApplicationId = application.Id,
            ApprovalDecision = ApprovalDecision.Approved,
            ApprovalNotes = "Some notes with my approval"
        };

        UseUserContext(new UserContext
        {
            Roles = [],
            ExternalAuthId = "",
            UserId = approvalReviewer.Id,
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.Member]
                }
            ]
        });

        // Act
        var response = await _applicationManager
            .Store<CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        response.Error.Should().NotBeNull();
        response.Error.Should().BeOfType<ValidationError>();

        var applicationInDb = await _dbContext.WaterConservationApplications.Where(app => app.Id == request.WaterConservationApplicationId)
            .Include(app => app.Submission)
            .ThenInclude(sub => sub.SubmissionNotes)
            .SingleOrDefaultAsync();
        applicationInDb.Submission!.RecommendedForDate.Should().Be(submission.RecommendedForDate);
        applicationInDb.Submission!.RecommendedAgainstDate.Should().Be(submission.RecommendedAgainstDate);
        applicationInDb.Submission!.RecommendedByUserId.Should().Be(submission.RecommendedByUserId);
        applicationInDb.Submission!.ApprovedDate.Should().Be(submission.ApprovedDate);
        applicationInDb.Submission!.DeniedDate.Should().Be(submission.DeniedDate);
        applicationInDb.Submission!.ApprovedByUserId.Should().Be(submission.ApprovedByUserId);
        applicationInDb.Submission!.SubmissionNotes.Should().HaveCount(0);
    }

    [DataTestMethod]
    [DataRow(ApprovalDecision.Approved)]
    [DataRow(ApprovalDecision.Denied)]
    public async Task Store_SubmitApplicationApproval_Success(ApprovalDecision decision)
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var technicalReviewerId = Guid.NewGuid();
        var technicalReviewer = new UserFaker()
            .RuleFor(user => user.Id, _ => technicalReviewerId).Generate();
        var approvalReviewerId = Guid.NewGuid();
        var approvalReviewer = new UserFaker()
            .RuleFor(user => user.Id, _ => approvalReviewerId).Generate();
        var organization = new OrganizationFaker().Generate();
        var diffOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application)
            .RuleFor(sub => sub.RecommendedForDate, _ => DateTimeOffset.Now)
            .RuleFor(sub => sub.RecommendedByUserId, _ => technicalReviewerId).Generate();

        await _dbContext.Users.AddRangeAsync(waterUser, technicalReviewer, approvalReviewer);
        await _dbContext.Organizations.AddRangeAsync(organization, diffOrganization);
        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.SaveChangesAsync();

        var request = new CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest
        {
            WaterConservationApplicationId = application.Id,
            ApprovalDecision = decision,
            ApprovalNotes = "Some notes with my approval decision"
        };

        UseUserContext(new UserContext
        {
            Roles = [],
            ExternalAuthId = "",
            UserId = approvalReviewer.Id,
            OrganizationRoles =
            [
                new OrganizationRole
                {
                    OrganizationId = organization.Id,
                    RoleNames = [Roles.Member]
                }
            ]
        });

        // Act
        var response = await _applicationManager
            .Store<CLI.Requests.Conservation.WaterConservationApplicationApprovalRequest, CLI.Responses.Conservation.ApplicationStoreResponseBase>(request);

        // Assert
        var applicationInDb = await _dbContext.WaterConservationApplications.Where(app => app.Id == request.WaterConservationApplicationId)
            .Include(app => app.Submission)
            .ThenInclude(sub => sub.SubmissionNotes)
            .SingleOrDefaultAsync();

        response.Error.Should().BeNull();
        response.Should().BeOfType<CLI.Responses.Conservation.ApplicationStoreResponseBase>();

        // recommendation info shouldn't have changed
        applicationInDb.Submission!.RecommendedForDate.Should().Be(submission.RecommendedForDate);
        applicationInDb.Submission!.RecommendedAgainstDate.Should().Be(submission.RecommendedAgainstDate);
        applicationInDb.Submission!.RecommendedByUserId.Should().Be(submission.RecommendedByUserId);

        // approval info should match the request
        applicationInDb.Submission!.ApprovedByUserId.Should().Be(approvalReviewer.Id);
        if (decision == ApprovalDecision.Approved)
        {
            applicationInDb.Submission!.ApprovedDate.Should().BeCloseTo(DateTimeOffset.Now, TimeSpan.FromMinutes(1));
            applicationInDb.Submission!.DeniedDate.Should().Be(null);
        }

        if (decision == ApprovalDecision.Denied)
        {
            applicationInDb.Submission!.ApprovedDate.Should().Be(null);
            applicationInDb.Submission!.DeniedDate.Should().BeCloseTo(DateTimeOffset.Now, TimeSpan.FromMinutes(1));
        }

        // application submission notes from the request should have been added
        applicationInDb.Submission!.SubmissionNotes.Should().HaveCount(1);
        applicationInDb.Submission!.SubmissionNotes.First().UserId.Should().Be(approvalReviewer.Id);
        applicationInDb.Submission!.SubmissionNotes.First().Note.Should().Be(request.ApprovalNotes);

        MessageBusUtilityMock.Verify(
            mock =>
                mock.SendMessageAsync(
                    Queues.ConservationApplicationStatusChanged,
                    It.Is<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase>(
                        // Check for derived event type
                        x => x is CLI.Requests.Conservation.WaterConservationApplicationApprovedEvent
                    )),
            Times.Once);
    }

    [TestMethod]
    public async Task OnApplicationStatusChanged_ApplicationSubmitted_ShouldSendEmails()
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var fundingOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, fundingOrganization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        var techReviewer = new UserFaker().Generate();
        var orgMember = new UserFaker().Generate();

        techReviewer.UserOrganizations =
        [
            new UserOrganizationFaker(techReviewer, fundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.TechnicalReviewer,
                    }
                }).Generate()
        ];

        orgMember.UserOrganizations =
        [
            new UserOrganizationFaker(orgMember, fundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.Member,
                    }
                }).Generate()
        ];

        var globalAdmins = new UserFaker()
            .RuleFor(u => u.UserRoles, _ => new List<UserRole> { new() { Role = Roles.GlobalAdmin } })
            .Generate(2);


        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.Users.AddRangeAsync(techReviewer, orgMember);
        await _dbContext.Users.AddRangeAsync(globalAdmins);
        await _dbContext.SaveChangesAsync();

        UseSystemContext();

        // Act
        var result = await _applicationManager.OnApplicationStatusChanged<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase, EventResponseBase>(
            new CLI.Requests.Conservation.WaterConservationApplicationSubmittedEvent
            {
                ApplicationId = application.Id,
            });

        // Assert
        result.Error.Should().BeNull();


        // Emails include:
        //      1 x Applicant
        //      1 x Tech Reviewer
        //      1 x Org Member
        //      2 x Global Admins
        EmailNotificationSdkMock
            .Verify(mock => mock.SendEmail(It.IsAny<EmailRequest>()), Times.Exactly(5));

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == waterUser.Email &&
                    req.Subject == "Water Conservation Application Submitted" &&
                    req.Body.Contains($"{application.Id.ToString()}/submit")
                )
            ),
            Times.Once
        );

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == techReviewer.Email &&
                    req.Subject == "New Water Conservation Application Submitted" &&
                    // Url to page where tech reviewer can make changes to application.
                    // This is because they have permission to edit the application (not approve)
                    req.Body.Contains($"{application.Id}/review")
                )
            ), Times.Once
        );

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == orgMember.Email &&
                    req.Subject == "New Water Conservation Application Submitted" &&
                    // Url to page where organization member can approve/deny application.
                    // This is because they have permission to approve the application (not edit)
                    req.Body.Contains($"{application.Id}/approve")
                )
            ), Times.Once
        );

        globalAdmins.Count.Should().Be(2);
        foreach (var globalAdmin in globalAdmins)
        {
            EmailNotificationSdkMock.Verify(
                mock => mock.SendEmail(
                    It.Is<EmailRequest>(req =>
                        req.To.Single() == globalAdmin.Email &&
                        req.Subject == "New Water Conservation Application Submitted" &&
                        req.Body.Contains($"A {fundingOrganization.Name} water conservation application has been submitted.") &&
                        req.Body.Contains($"{application.Id}/approve")
                    )
                ), Times.Once
            );
        }
    }

    [TestMethod]
    public async Task OnApplicationStatusChanged_ApplicationRecommended_ShouldSendEmails()
    {
        // Arrange
        var waterUser = new UserFaker().Generate();
        var fundingOrganization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(waterUser, fundingOrganization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        var techReviewer = new UserFaker().Generate();
        var orgMember = new UserFaker().Generate();
        var orgAdmin = new UserFaker().Generate();

        techReviewer.UserOrganizations =
        [
            new UserOrganizationFaker(techReviewer, fundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.TechnicalReviewer,
                    }
                }).Generate()
        ];

        orgMember.UserOrganizations =
        [
            new UserOrganizationFaker(orgMember, fundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.Member,
                    }
                }).Generate()
        ];

        orgAdmin.UserOrganizations =
        [
            new UserOrganizationFaker(orgAdmin, fundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.OrganizationAdmin,
                    }
                }).Generate()
        ];


        await _dbContext.WaterConservationApplications.AddAsync(application);
        await _dbContext.WaterConservationApplicationSubmissions.AddAsync(submission);
        await _dbContext.Users.AddRangeAsync(techReviewer, orgMember, orgAdmin);
        await _dbContext.SaveChangesAsync();

        UseSystemContext();


        // Act
        var result = await _applicationManager.OnApplicationStatusChanged<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase, EventResponseBase>(
            new CLI.Requests.Conservation.WaterConservationApplicationRecommendedEvent
            {
                ApplicationId = application.Id,
            });

        // Assert
        result.Error.Should().BeNull();

        // Emails include:
        //      1 x Member
        //      1 x Org Admin
        //      0 x Tech Reviewer

        EmailNotificationSdkMock
            .Verify(mock => mock.SendEmail(It.IsAny<EmailRequest>()), Times.Exactly(2));

        var expectedSubject = "Water Conservation Application Recommendation";
        var expectedUrlSlug = $"{application.Id}/approve"; // Link to final approval page

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == orgMember.Email &&
                    req.Subject == expectedSubject &&
                    req.Body.Contains(expectedUrlSlug)
                )
            ),
            Times.Once
        );

        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == orgAdmin.Email &&
                    req.Subject == expectedSubject &&
                    req.Body.Contains(expectedUrlSlug)
                )
            ), Times.Once
        );
    }

    [TestMethod]
    public async Task OnApplicationStatusChanged_ApplicationApproved_ShouldSendEmail()
    {
        // Arrange
        var orgAdmin = new UserFaker().Generate();
        await _dbContext.Users.AddAsync(orgAdmin);
        await _dbContext.SaveChangesAsync();

        var submission = SetupApplicationSubmission();

        orgAdmin.UserOrganizations =
        [
            new UserOrganizationFaker(orgAdmin, submission.WaterConservationApplication.FundingOrganization)
                .RuleFor(uo => uo.UserOrganizationRoles, _ => new List<UserOrganizationRole>
                {
                    new()
                    {
                        Role = Roles.OrganizationAdmin,
                    }
                }).Generate()
        ];

        submission.ApprovedDate = DateTimeOffset.UtcNow;
        submission.ApprovedByUserId = orgAdmin.Id;

        await _dbContext.SaveChangesAsync();

        UseSystemContext();

        // Act
        var approvalNote = "Your payment will be processed in the next 42 business days.";
        var result = await _applicationManager.OnApplicationStatusChanged<CLI.Requests.Conservation.WaterConservationApplicationStatusChangedEventBase, EventResponseBase>(
            new CLI.Requests.Conservation.WaterConservationApplicationApprovedEvent
            {
                ApplicationId = submission.WaterConservationApplication.Id,
                ApprovalNote = approvalNote
            });

        // Assert
        result.Error.Should().BeNull();

        var expectedSubject = "Water Conservation Application Approved";
        var expectedUrlSlug = $"{submission.WaterConservationApplication.Id}/submit"; // Link to final submit page

        EmailNotificationSdkMock.Verify(mock => mock.SendEmail(It.IsAny<EmailRequest>()), Times.Once);
        EmailNotificationSdkMock.Verify(
            mock => mock.SendEmail(
                It.Is<EmailRequest>(req =>
                    req.To.Single() == submission.WaterConservationApplication.ApplicantUser.Email &&
                    req.Subject == expectedSubject &&
                    req.Body.Contains("application has been approved with the following note:") &&
                    req.Body.Contains(approvalNote) &&
                    req.Body.Contains(expectedUrlSlug)
                )
            ),
            Times.Once
        );
    }

    private WaterConservationApplicationSubmission SetupApplicationSubmission()
    {
        var applicant = new UserFaker().Generate();
        var organization = new OrganizationFaker().Generate();
        var application = new WaterConservationApplicationFaker(applicant, organization).Generate();
        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();

        _dbContext.Users.AddRangeAsync(applicant);
        _dbContext.Organizations.Add(organization);
        _dbContext.WaterConservationApplications.Add(application);
        _dbContext.WaterConservationApplicationSubmissions.Add(submission);

        return submission;
    }

    private async Task ClearDatabases(DatabaseContext wadeDb, WestDaatDatabaseContext westdaatDb)
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

        _dbContext.ControlLocationWaterMeasurements.RemoveRange(_dbContext.ControlLocationWaterMeasurements);
        _dbContext.LocationWaterMeasurements.RemoveRange(_dbContext.LocationWaterMeasurements);
        _dbContext.WaterConservationApplicationEstimateControlLocations.RemoveRange(_dbContext.WaterConservationApplicationEstimateControlLocations);
        _dbContext.WaterConservationApplicationEstimateLocations.RemoveRange(_dbContext.WaterConservationApplicationEstimateLocations);
        _dbContext.WaterConservationApplicationEstimates.RemoveRange(_dbContext.WaterConservationApplicationEstimates);
        _dbContext.WaterConservationApplicationSubmissionNotes.RemoveRange(_dbContext.WaterConservationApplicationSubmissionNotes);
        _dbContext.WaterConservationApplicationSubmissions.RemoveRange(_dbContext.WaterConservationApplicationSubmissions);
        _dbContext.WaterConservationApplications.RemoveRange(_dbContext.WaterConservationApplications);
        _dbContext.UserProfiles.RemoveRange(_dbContext.UserProfiles);
        _dbContext.Users.RemoveRange(_dbContext.Users);
        _dbContext.Organizations.RemoveRange(_dbContext.Organizations);
        await _dbContext.SaveChangesAsync();
    }
}