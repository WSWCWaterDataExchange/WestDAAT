using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Managers;

public partial class ConservationManager : ManagerBase
{
    private readonly IApplicationAccessor _applicationAccessor;
    private readonly IUserAccessor _userAccessor;

    public ConservationManager(
        ILogger<ConservationManager> logger,
        IApplicationAccessor applicationAccessor,
        IUserAccessor userAccessor
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
    }
}