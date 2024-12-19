using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : ManagerBase
{
    private readonly IApplicationAccessor _applicationAccessor;

    public ConservationManager(
        ILogger<ConservationManager> logger,
        IApplicationAccessor applicationAccessor
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
    }
}