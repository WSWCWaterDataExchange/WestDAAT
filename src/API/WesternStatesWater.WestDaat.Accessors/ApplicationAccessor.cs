using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Accessors;

internal class ApplicationAccessor : AccessorBase, IApplicationAccessor
{
    public ApplicationAccessor(ILogger<ApplicationAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
    }

    private readonly EF.IDatabaseContextFactory _databaseContextFactory;
}