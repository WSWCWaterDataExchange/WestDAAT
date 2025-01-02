using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : ManagerBase
{
    public ConservationManager(
        IManagerRequestHandlerResolver resolver,
        IValidationEngine validationEngine,
        ILogger<ConservationManager> logger
    ) : base(resolver, validationEngine, logger)
    {
    }
}