using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Common.Exceptions;

namespace WesternStatesWater.WestDaat.Accessors;

internal class ApplicationAccessor : AccessorBase, IApplicationAccessor
{
    private readonly EF.IDatabaseContextFactory _databaseContextFactory;
    private readonly EFWD.IWestDaatDatabaseContextFactory _westDaatDatabaseContextFactory;

    public ApplicationAccessor(ILogger<ApplicationAccessor> logger,
        EF.IDatabaseContextFactory databaseContextFactory,
        EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
        _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
    }

    public async Task<ApplicationLoadResponseBase> Load(ApplicationLoadRequestBase request)
    {
        return request switch
        {
            ApplicationDashboardLoadRequest req => await GetDashboardApplications(req),
            ApplicationLoadSingleRequest req => await GetApplication(req),
            ApplicationExistsLoadRequest req => await CheckApplicationExists(req),
            ApplicationFindSequentialIdLoadRequest req => await FindSequentialDisplayId(req),
            ApplicationDocumentLoadSingleRequest req => await GetApplicationDocument(req),
            ApplicationSupportingDocumentExistsRequest req => await CheckApplicationDocumentExists(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<ApplicationDashboardLoadResponse> GetDashboardApplications(ApplicationDashboardLoadRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var applicationsQuery = db.WaterConservationApplications.AsQueryable();

        if (request.OrganizationId != null)
        {
            applicationsQuery = applicationsQuery.Where(app => app.FundingOrganizationId == request.OrganizationId);
        }

        var applications = await applicationsQuery
            .Where(app => app.Submission != null && app.Estimate != null)
            .ProjectTo<ApplicationListItemDetails>(DtoMapper.Configuration)
            .OrderByDescending(app => app.SubmittedDate)
            .ToListAsync();

        return new ApplicationDashboardLoadResponse
        {
            Applications = applications.ToArray()
        };
    }

    private async Task<ApplicationLoadSingleResponse> GetApplication(ApplicationLoadSingleRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var application = await db.WaterConservationApplications
            .Where(app => app.Id == request.ApplicationId)
            .ProjectTo<ApplicationDetails>(DtoMapper.Configuration)
            .SingleAsync();


        var reviewPipeline = await GetReviewPipeline(request.ApplicationId);
        application.ReviewPipeline = reviewPipeline;

        return new ApplicationLoadSingleResponse
        {
            Application = application,
        };
    }

    private async Task<ReviewPipeline> GetReviewPipeline(Guid applicationId)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var reviewPipelineSrc = await db.WaterConservationApplications
            .AsNoTracking()
            .Include(app => app.ApplicantUser).ThenInclude(applicant => applicant.UserProfile)
            .Include(app => app.Submission).ThenInclude(submission => submission.RecommendedByUser).ThenInclude(recUser => recUser.UserProfile)
            .Include(app => app.Submission).ThenInclude(submission => submission.ApprovedByUser).ThenInclude(approver => approver.UserProfile)
            .SingleAsync(app => app.Id == applicationId);


        var applicant = reviewPipelineSrc.ApplicantUser.UserProfile;
        var submission = reviewPipelineSrc.Submission;
        var recommender = submission.RecommendedByUser?.UserProfile;
        var approver = submission.ApprovedByUser?.UserProfile;


        var reviewSteps = new List<ReviewStep>();


        // Applicant submit step
        reviewSteps.Add(new ReviewStep
        {
            ReviewStepType = ReviewStepType.ApplicantSubmitted,
            ReviewStepStatus = ReviewStepStatus.Submitted,
            ParticipantName = $"{applicant.FirstName} {applicant.LastName}",
            ReviewDate = reviewPipelineSrc.Submission.SubmittedDate
        });


        // Recommendation step (if exists)
        if (reviewPipelineSrc.Submission.RecommendedByUserId.HasValue)
        {
            var status = (submission.RecommendedForDate.HasValue, submission.RecommendedAgainstDate.HasValue) switch
            {
                (true, false) => ReviewStepStatus.RecommendedForApproval,
                (false, true) => ReviewStepStatus.RecommendedAgainstApproval,
                _ => throw new WestDaatException("Invalid recommendation status."),
            };

            var reviewDate = status switch
            {
                ReviewStepStatus.RecommendedForApproval => submission.RecommendedForDate,
                ReviewStepStatus.RecommendedAgainstApproval => submission.RecommendedAgainstDate,
                _ => throw new WestDaatException("Invalid recommendation status."),
            };

            reviewSteps.Add(new ReviewStep
            {
                ReviewStepType = ReviewStepType.Recommendation,
                ReviewStepStatus = status,
                ParticipantName = $"{recommender.FirstName} {recommender.LastName}",
                ReviewDate = reviewDate.Value,
            });
        }

        // Approval step (if exists)
        if (reviewPipelineSrc.Submission.ApprovedByUserId.HasValue)
        {
            var status = (submission.AcceptedDate.HasValue, submission.RejectedDate.HasValue) switch
            {
                (true, false) => ReviewStepStatus.Approved,
                (false, true) => ReviewStepStatus.Denied,
                _ => throw new WestDaatException("Invalid approval status."),
            };

            var approveDate = status switch
            {
                ReviewStepStatus.Approved => submission.AcceptedDate,
                ReviewStepStatus.Denied => submission.RejectedDate,
                _ => throw new WestDaatException("Invalid approval status."),
            };

            reviewSteps.Add(new ReviewStep
            {
                ReviewStepType = ReviewStepType.Approval,
                ReviewStepStatus = status,
                ParticipantName = $"{approver.FirstName} {approver.LastName}",
                ReviewDate = approveDate.Value,
            });
        }

        return new ReviewPipeline
        {
            ReviewSteps = reviewSteps.ToArray()
        };
    }

    private async Task<ApplicationExistsLoadResponse> CheckApplicationExists(ApplicationExistsLoadRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        IQueryable<EFWD.WaterConservationApplication> applicationQuery = db.WaterConservationApplications
            .Include(app => app.Submission)
            .AsNoTracking();

        if (request.ApplicationId.HasValue)
        {
            applicationQuery = applicationQuery.Where(app => app.Id == request.ApplicationId.Value);
        }

        if (!string.IsNullOrEmpty(request.WaterRightNativeId))
        {
            applicationQuery = applicationQuery.Where(app => app.WaterRightNativeId == request.WaterRightNativeId);
        }

        if (request.ApplicantUserId.HasValue)
        {
            applicationQuery = applicationQuery.Where(app => app.ApplicantUserId == request.ApplicantUserId.Value);
        }

        if (request.HasSubmission.HasValue)
        {
            if (request.HasSubmission == true)
            {
                applicationQuery = applicationQuery.Where(app => app.Submission != null);
            }
            else
            {
                applicationQuery = applicationQuery.Where(app => app.Submission == null);
            }
        }

        var response = await applicationQuery
            .ProjectTo<ApplicationExistsLoadResponse>(DtoMapper.Configuration)
            .SingleOrDefaultAsync();

        return response ?? new ApplicationExistsLoadResponse
        {
            ApplicationExists = false
        };
    }

    private async Task<ApplicationFindSequentialIdLoadResponse> FindSequentialDisplayId(ApplicationFindSequentialIdLoadRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var entities = await db.WaterConservationApplications
            .AsNoTracking()
            .Where(app => app.ApplicationDisplayId.StartsWith(request.ApplicationDisplayIdStub))
            .ToArrayAsync();

        int lastId = 0;

        if (entities.Length > 0)
        {
            var displayIdDelimiter = '-';

            var lastEntity = entities
                .OrderByDescending(app =>
                {
                    var idStringLastSection = app.ApplicationDisplayId.Split(displayIdDelimiter).Last();
                    return int.Parse(idStringLastSection);
                })
                .First();

            var idStringLastSection = lastEntity.ApplicationDisplayId.Split(displayIdDelimiter).Last();
            lastId = int.Parse(idStringLastSection);
        }

        return new ApplicationFindSequentialIdLoadResponse
        {
            LastDisplayIdSequentialNumber = lastId,
        };
    }

    private async Task<ApplicationDocumentLoadSingleResponse> GetApplicationDocument(ApplicationDocumentLoadSingleRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var document = await db.WaterConservationApplicationDocuments
            .Where(doc => doc.Id == request.WaterConservationApplicationDocumentId)
            .ProjectTo<SupportingDocumentDetails>(DtoMapper.Configuration)
            .SingleOrDefaultAsync();

        return new ApplicationDocumentLoadSingleResponse
        {
            SupportingDocument = document
        };
    }

    private async Task<ApplicationSupportingDocumentExistsResponse> CheckApplicationDocumentExists(ApplicationSupportingDocumentExistsRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var document = await db.WaterConservationApplicationDocuments
            .AsNoTracking()
            .Where(doc => doc.Id == request.WaterConservationApplicationDocumentId)
            .Include(doc => doc.WaterConservationApplication)
            .SingleOrDefaultAsync();

        return new ApplicationSupportingDocumentExistsResponse
        {
            DocumentExists = document != null,
            ApplicantUserId = document?.WaterConservationApplication.ApplicantUserId,
            FundingOrganizationId = document?.WaterConservationApplication.FundingOrganizationId,
        };
    }

    public async Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request)
    {
        return request switch
        {
            ApplicationEstimateStoreRequest req => await StoreApplicationEstimate(req),
            WaterConservationApplicationCreateRequest req => await CreateWaterConservationApplication(req),
            WaterConservationApplicationSubmissionRequest req => await SubmitApplication(req),
            WaterConservationApplicationSubmissionUpdateRequest req => await UpdateApplicationSubmission(req),
            WaterConservationApplicationRecommendationRequest req => await SubmitApplicationRecommendation(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<ApplicationStoreResponseBase> StoreApplicationEstimate(ApplicationEstimateStoreRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var existingEntity = await db.WaterConservationApplicationEstimates
            .AsNoTracking()
            .Include(estimate => estimate.Locations)
            .ThenInclude(location => location.ConsumptiveUses)
            .FirstOrDefaultAsync(estimate => estimate.WaterConservationApplicationId == request.WaterConservationApplicationId);

        if (existingEntity != null)
        {
            db.LocationWaterMeasurements
                .RemoveRange(existingEntity.Locations.SelectMany(location => location.ConsumptiveUses));

            db.WaterConservationApplicationEstimateLocations.RemoveRange(existingEntity.Locations);

            db.WaterConservationApplicationEstimates.Remove(existingEntity);
        }

        var entity = request.Map<EFWD.WaterConservationApplicationEstimate>();

        await db.WaterConservationApplicationEstimates.AddAsync(entity);
        await db.SaveChangesAsync();

        return new ApplicationEstimateStoreResponse
        {
            Details = DtoMapper.Map<ApplicationEstimateLocationDetails[]>(entity.Locations)
        };
    }

    private async Task<WaterConservationApplicationCreateResponse> CreateWaterConservationApplication(WaterConservationApplicationCreateRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var entity = request.Map<EFWD.WaterConservationApplication>();

        await db.WaterConservationApplications.AddAsync(entity);
        await db.SaveChangesAsync();

        return new WaterConservationApplicationCreateResponse
        {
            WaterConservationApplicationId = entity.Id,
            WaterConservationApplicationDisplayId = entity.ApplicationDisplayId,
        };
    }

    private async Task<ApplicationStoreResponseBase> SubmitApplication(WaterConservationApplicationSubmissionRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        // save submission to db
        var entity = request.Map<EFWD.WaterConservationApplicationSubmission>();
        await db.WaterConservationApplicationSubmissions.AddAsync(entity);

        // update related estimate locations' details
        var existingApplication = await db.WaterConservationApplications
            .Include(wca => wca.Estimate)
            .ThenInclude(estimate => estimate.Locations)
            .Where(wca => wca.Id == request.WaterConservationApplicationId)
            .SingleAsync();

        var documents = request.SupportingDocuments.Map<EFWD.WaterConservationApplicationDocument[]>();
        existingApplication.SupportingDocuments = documents;

        foreach (var details in request.FieldDetails)
        {
            var existingEstimateLocation = existingApplication.Estimate.Locations
                .SingleOrDefault(location => location.Id == details.WaterConservationApplicationEstimateLocationId);

            if (existingEstimateLocation == null)
            {
                throw new WestDaatException("Estimate location not found.");
            }

            DtoMapper.Map(details, existingEstimateLocation);
        }

        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
    }

    private async Task<WaterConservationApplicationSubmissionUpdateResponse> UpdateApplicationSubmission(WaterConservationApplicationSubmissionUpdateRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var application = await db.WaterConservationApplications
            .Include(a => a.Submission).ThenInclude(sub => sub.SubmissionNotes)
            .Include(a => a.Estimate).ThenInclude(estimate => estimate.Locations)
            .Include(a => a.SupportingDocuments)
            .Where(a => a.Id == request.WaterConservationApplicationId)
            .SingleAsync();

        // update submission
        DtoMapper.Map(request, application.Submission);

        // update estimate locations
        foreach (var details in request.FieldDetails)
        {
            var existingEstimateLocation = application.Estimate.Locations
                .SingleOrDefault(location => location.Id == details.WaterConservationApplicationEstimateLocationId);

            if (existingEstimateLocation == null)
            {
                throw new WestDaatException("Estimate location not found.");
            }

            DtoMapper.Map(details, existingEstimateLocation);
        }

        // overwrite supporting documents
        foreach (var document in application.SupportingDocuments)
        {
            db.WaterConservationApplicationDocuments.Remove(document);
        }

        var newDocuments = request.SupportingDocuments.Map<EFWD.WaterConservationApplicationDocument[]>();
        foreach (var document in newDocuments)
        {
            application.SupportingDocuments.Add(document);
        }

        // add new note
        var note = request.Map<EFWD.WaterConservationApplicationSubmissionNote>();
        application.Submission.SubmissionNotes.Add(note);

        await db.SaveChangesAsync();

        var savedNote = await db.WaterConservationApplicationSubmissionNotes
            .Include(n => n.User).ThenInclude(user => user.UserProfile)
            .Where(n => n.Id == note.Id)
            .ProjectTo<ApplicationReviewNote>(DtoMapper.Configuration)
            .SingleAsync();

        return new WaterConservationApplicationSubmissionUpdateResponse
        {
            Note = savedNote
        };
    }

    private async Task<ApplicationStoreResponseBase> SubmitApplicationRecommendation(WaterConservationApplicationRecommendationRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();
        var application = await db.WaterConservationApplications
            .Include(a => a.Submission)
            .ThenInclude(sub => sub.SubmissionNotes)
            .Where(a => a.Id == request.WaterConservationApplicationId)
            .SingleAsync();

        DtoMapper.Map(request, application.Submission);

        if (!string.IsNullOrEmpty(request.RecommendationNotes))
        {
            var note = request.Map<EFWD.WaterConservationApplicationSubmissionNote>();
            note.WaterConservationApplicationSubmissionId = application.Submission.Id;
            application.Submission.SubmissionNotes.Add(note);
        }

        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
    }
}