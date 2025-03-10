using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : EngineBase
{
    private readonly IOrganizationAccessor _organizationAccessor;

    private readonly IApplicationAccessor _applicationAccessor;

    private readonly IUserAccessor _userAccessor;

    public FormattingEngine(
        ILogger<FormattingEngine> logger,
        IApplicationAccessor applicationAccessor,
        IOrganizationAccessor organizationAccessor,
        IUserAccessor userAccessor
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
        _organizationAccessor = organizationAccessor;
        _userAccessor = userAccessor;
    }
}