using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Managers;

public partial class AdminManager : ManagerBase
{
    private readonly IUserAccessor _userAccessor;
    
    public AdminManager(
        ILogger<AdminManager> logger,
        IUserAccessor userAccessor
    ) : base(logger)
    {
        _userAccessor = userAccessor;
    }
}