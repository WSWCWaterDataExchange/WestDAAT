using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors;

internal class ApplicationAccessor : AccessorBase, IApplicationAccessor
{
    private readonly EF.IDatabaseContextFactory _databaseContextFactory;

    public ApplicationAccessor(ILogger<ApplicationAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
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
}