using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : ManagerBase
{
    public ConservationManager(
        ILogger<ConservationManager> logger
    ) : base(logger)
    {
    }
}