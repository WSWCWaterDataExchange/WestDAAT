using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FilteringEngine : EngineBase
{
    private readonly IApplicationAccessor _applicationAccessor;

    private readonly IUserAccessor _userAccessor;

    private readonly ISecurityUtility _securityUtility;

    public FilteringEngine(
        ILogger<FilteringEngine> logger,
        IApplicationAccessor applicationAccessor,
        IUserAccessor userAccessor,
        ISecurityUtility securityUtility
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
        _userAccessor = userAccessor;
        _securityUtility = securityUtility;
    }
}