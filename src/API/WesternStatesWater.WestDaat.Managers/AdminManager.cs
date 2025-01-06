using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers;

public partial class AdminManager : ManagerBase
{
    public AdminManager(
        IManagerRequestHandlerResolver resolver,
        IValidationEngine validationEngine,
        ILogger<AdminManager> logger
    ) : base(resolver, validationEngine, logger)
    {
    }
}