using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FilteringEngine : EngineBase
{
    private readonly IApplicationAccessor _applicationAccessor;
    
    private readonly IUserAccessor _userAccessor;

    public FilteringEngine(
        ILogger<FilteringEngine> logger,
        IApplicationAccessor applicationAccessor,
        IUserAccessor userAccessor
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
        _userAccessor = userAccessor;
    }
}