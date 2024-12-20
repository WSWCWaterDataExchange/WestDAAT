using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Accessors;

internal class UserAccessor : AccessorBase, IUserAccessor
{
    public UserAccessor(ILogger<UserAccessor> logger, EF.IDatabaseContextFactory databaseContextFactory) : base(logger)
    {
        _databaseContextFactory = databaseContextFactory;
    }

    private readonly EF.IDatabaseContextFactory _databaseContextFactory;
}