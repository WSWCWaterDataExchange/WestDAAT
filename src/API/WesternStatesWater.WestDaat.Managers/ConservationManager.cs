using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Managers.Handlers;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : ManagerBase
{
    public ConservationManager(
        IManagerRequestHandlerResolver resolver,
        ILogger<ConservationManager> logger
    ) : base(resolver, logger)
    {
    }
}