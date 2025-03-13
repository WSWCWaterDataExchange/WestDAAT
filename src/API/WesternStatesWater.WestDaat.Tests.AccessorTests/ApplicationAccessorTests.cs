using Microsoft.EntityFrameworkCore;
using System.Reflection;
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

    public async Task Load_GetFullApplicationDetails_SucceedsForEveryRequestType()
    {
        // Arrange
        var user = new UserFaker().Generate();
        var org = new OrganizationFaker().Generate();

        var application = new WaterConservationApplicationFaker(user, org).Generate();
        await _westDaatDb.WaterConservationApplications.AddAsync(application);

        var estimate = new WaterConservationApplicationEstimateFaker(application).Generate();
        await _westDaatDb.WaterConservationApplicationEstimates.AddAsync(estimate);

        var locations = new WaterConservationApplicationEstimateLocationFaker(estimate).Generate(3);
        await _westDaatDb.WaterConservationApplicationEstimateLocations.AddRangeAsync(locations);

        foreach (var location in locations)
        {
            var consumptiveUses = new WaterConservationApplicationEstimateLocationConsumptiveUseFaker(location).Generate(2);
            await _westDaatDb.WaterConservationApplicationEstimateLocationConsumptiveUses.AddRangeAsync(consumptiveUses);
        }

        var submission = new WaterConservationApplicationSubmissionFaker(application).Generate();
        await _westDaatDb.WaterConservationApplicationSubmissions.AddAsync(submission);

        var documents = new WaterConservationApplicationDocumentsFaker(application).Generate(2);
        await _westDaatDb.WaterConservationApplicationDocuments.AddRangeAsync(documents);

        await _westDaatDb.SaveChangesAsync();

        // Act
        var applicantRequest = new ApplicantConservationApplicationLoadRequest
        {
            ApplicationId = application.Id
        };
        var reviewerRequest = new ReviewerConservationApplicationLoadRequest
        {
            ApplicationId = application.Id
        };

        var applicantResponse = (ApplicantConservationApplicationLoadResponse)await _accessor.Load(applicantRequest);
        var reviewerResponse = (ReviewerConservationApplicationLoadResponse)await _accessor.Load(reviewerRequest);

        // Assert

        // ExcludingMissingMembers is used to ignore properties that are intentionally not included in the response
        // i.e. virtual navigation properties and parent id properties
        applicantResponse.Should().NotBeNull();
        applicantResponse.Application.Should().BeEquivalentTo(application, options => options.ExcludingMissingMembers());
        // the following assertions are redundant given that `BeEquivalentTo` checks properties recursively,
        // but are included for completeness just in case something changes in the future
        applicantResponse.Application.Estimate.Should().BeEquivalentTo(estimate, options => options.ExcludingMissingMembers());
        applicantResponse.Application.Estimate.Locations.Should().BeEquivalentTo(locations, options => options.ExcludingMissingMembers());
        applicantResponse.Application.Estimate.Locations.SelectMany(l => l.ConsumptiveUses).Should().BeEquivalentTo(locations.SelectMany(l => l.ConsumptiveUses), options => options.ExcludingMissingMembers());
        applicantResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        applicantResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());

        reviewerResponse.Should().NotBeNull();
        reviewerResponse.Application.Should().BeEquivalentTo(application, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Should().BeEquivalentTo(estimate, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.Should().BeEquivalentTo(locations, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Estimate.Locations.SelectMany(l => l.ConsumptiveUses).Should().BeEquivalentTo(locations.SelectMany(l => l.ConsumptiveUses), options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Submission.Should().BeEquivalentTo(submission, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.SupportingDocuments.Should().BeEquivalentTo(documents, options => options.ExcludingMissingMembers());
        reviewerResponse.Application.Notes.Should().BeNull(); // not implemented yet

        // verify that all possible request types are accounted for
        var requests = Assembly.GetAssembly(typeof(ApplicationLoadSingleRequestBase))?
            .GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && t.IsSubclassOf(typeof(ApplicationLoadSingleRequestBase)))
            .ToArray();

        requests.Length.Should().Be(2, because: "this test currently only accounts for the specified number of request types. If more request types are added, this test should then be updated.");
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
        response.InProgressApplicationDisplayId.Should().Be(application.ApplicationDisplayId);
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
        response.InProgressApplicationDisplayId.Should().BeNull();
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
        response.InProgressApplicationDisplayId.Should().BeNull();
    }

    [DataTestMethod]
    [DataRow(false, false, false, DisplayName = "Application does not exist")]
    [DataRow(true, false, false, DisplayName = "Application exists but has no submission")]
    [DataRow(true, true, true, DisplayName = "Application exists and has submission")]
    public async Task Load_CheckSubmittedApplicationExists_Success(
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
            await _westDaatDb.SaveChangesAsync();
        }


        // Act
        var request = new SubmittedApplicationExistsLoadRequest
        {
            ApplicationId = application?.Id ?? Guid.NewGuid()
        };
        var response = (SubmittedApplicationExistsLoadResponse)await _accessor.Load(request);

        // Assert
        response.Should().NotBeNull();

        response.ApplicationExists.Should().Be(expectedExists);

        if (expectedExists)
        {
            response.ApplicantUserId.Should().Be(application.ApplicantUserId);
            response.FundingOrganizationId.Should().Be(application.FundingOrganizationId);
        }
        else
        {
            response.ApplicantUserId.Should().BeNull();
            response.FundingOrganizationId.Should().BeNull();
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
}