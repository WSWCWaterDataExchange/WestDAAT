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
            UnsubmittedApplicationExistsLoadRequest req => await CheckInProgressApplicationExists(req),
            ApplicationFindSequentialIdLoadRequest req => await FindSequentialDisplayId(req),
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

    private async Task<UnsubmittedApplicationExistsLoadResponse> CheckInProgressApplicationExists(UnsubmittedApplicationExistsLoadRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var existingInProgressApplication = await db.WaterConservationApplications
            .AsNoTracking()
            .Include(wca => wca.Submission)
            .SingleOrDefaultAsync(wca => wca.ApplicantUserId == request.ApplicantUserId &&
                                         wca.WaterRightNativeId == request.WaterRightNativeId &&
                                         wca.Submission == null);

        return new UnsubmittedApplicationExistsLoadResponse
        {
            InProgressApplicationId = existingInProgressApplication?.Id,
            InProgressApplicationDisplayId = existingInProgressApplication?.ApplicationDisplayId,
            FundingOrganizationId = existingInProgressApplication?.FundingOrganizationId,
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

    public async Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request)
    {
        return request switch
        {
            ApplicationEstimateStoreRequest req => await StoreApplicationEstimate(req),
            WaterConservationApplicationCreateRequest req => await CreateWaterConservationApplication(req),
            WaterConservationApplicationSubmissionRequest req => await SubmitApplication(req),
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
            db.WaterConservationApplicationEstimateLocationConsumptiveUses
                .RemoveRange(existingEntity.Locations.SelectMany(location => location.ConsumptiveUses));

            db.WaterConservationApplicationEstimateLocations.RemoveRange(existingEntity.Locations);

            db.WaterConservationApplicationEstimates.Remove(existingEntity);
        }

        var entity = request.Map<EFWD.WaterConservationApplicationEstimate>();

        await db.WaterConservationApplicationEstimates.AddAsync(entity);
        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
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

        foreach (var details in request.FieldDetails)
        {
            var existingEstimateLocation = existingApplication.Estimate.Locations
                .SingleOrDefault(location => location.PolygonWkt == details.PolygonWkt);

            if (existingEstimateLocation == null)
            {
                throw new WestDaatException("Estimate location not found.");
            }

            DtoMapper.Map(details, existingEstimateLocation);
        }

        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
    }
}