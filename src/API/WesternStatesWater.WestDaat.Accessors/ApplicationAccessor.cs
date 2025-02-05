using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

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
    // WaterConservationApplicationEstimate.EstimatedCompensationDollars = Total obligation
        // application's estimate >> then find that estimate's locations >> then for each location, find all consumptive uses
        // WaterConservationApplicationEstimateLocationConsumptiveUse.EtInInches
        var applications = await applicationsQuery
            // TODO: JN - could Estimates ever be null?
            .Where(app => app.Submission != null && app.Estimate != null)
            .ProjectTo<ApplicationListItemDetails>(DtoMapper.Configuration)
            .OrderByDescending(app => app.SubmittedDate)
            .ToListAsync();

        return new ApplicationDashboardLoadResponse
        {
            Applications = applications.ToArray()
        };
    }
}