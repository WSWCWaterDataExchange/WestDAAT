using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers;

public partial class AdminManager : ManagerBase
{
    public AdminManager(
        IManagerRequestHandlerResolver resolver,
        ILogger<AdminManager> logger
    ) : base(resolver, logger)
    {
    }
}