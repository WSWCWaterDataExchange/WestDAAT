using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors.Mapping;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

internal class ApplicationAccessor : AccessorBase, IApplicationAccessor
{
    private readonly EF.IDatabaseContextFactory _databaseContextFactory;
    private readonly EFWD.IWestDaatDatabaseContextFactory _westDaatDatabaseContextFactory;

    public ApplicationAccessor(
        ILogger<ApplicationAccessor> logger,
        EF.IDatabaseContextFactory databaseContextFactory,
        EFWD.IWestDaatDatabaseContextFactory westDaatDatabaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
        _westDaatDatabaseContextFactory = westDaatDatabaseContextFactory;
    }

    public async Task<ApplicationStoreResponseBase> Store(ApplicationStoreRequestBase request)
    {
        return request switch
        {
            ApplicationEstimateStoreRequest req => await StoreApplicationEstimate(req),
            _ => throw new NotImplementedException()
        };
    }

    private async Task<ApplicationStoreResponseBase> StoreApplicationEstimate(ApplicationEstimateStoreRequest request)
    {
        await using var db = _westDaatDatabaseContextFactory.Create();

        var entity = request.Map<EFWD.WaterConservationApplicationEstimate>();

        await db.WaterConservationApplicationEstimates.AddAsync(entity);
        await db.SaveChangesAsync();

        return new ApplicationStoreResponseBase();
    }
}