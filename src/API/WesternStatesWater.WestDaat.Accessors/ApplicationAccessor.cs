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
        await Task.CompletedTask;
        throw new NotImplementedException("Jenny needs to add this in a second PR");
    }

    public async Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request)
    {
        return request switch
        {
            ApplicationEstimateStoreRequest req => await StoreApplicationEstimate(req),
            _ => throw new NotImplementedException(
                $"Handling of request type '{request.GetType().Name}' is not implemented.")
        };
    }

    private async Task<ApplicationStoreResponseBase> StoreApplicationEstimate(ApplicationEstimateStoreRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var existingEntity = await db.WaterConservationApplicationEstimates
            .Include(estimate => estimate.Locations)
            .ThenInclude(location => location.ConsumptiveUses)
            .FirstOrDefaultAsync(estimate => estimate.WaterConservationApplicationId == request.WaterConservationApplicationId);

        if (existingEntity != null)
        {
            db.WaterConservationApplicationEstimateLocationConsumptiveUses
                .RemoveRange(existingEntity.Locations.SelectMany(location => location.ConsumptiveUses));

            db.WaterConservationApplicationEstimateLocations.RemoveRange(existingEntity.Locations);

            db.WaterConservationApplicationEstimates.Remove(existingEntity);

            await db.SaveChangesAsync();
        }

        var entity = request.Map<EFWD.WaterConservationApplicationEstimate>();

        await db.WaterConservationApplicationEstimates.AddAsync(entity);
        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
    }
}