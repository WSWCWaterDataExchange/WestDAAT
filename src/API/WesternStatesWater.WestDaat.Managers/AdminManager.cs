using Microsoft.Extensions.Logging;

namespace WesternStatesWater.WestDaat.Managers;

public partial class AdminManager : ManagerBase
{
    public AdminManager(
        ILogger<AdminManager> logger
    ) : base(logger)
    {
    }
}