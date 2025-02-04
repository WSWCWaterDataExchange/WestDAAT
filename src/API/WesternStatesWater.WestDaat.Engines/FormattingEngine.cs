using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : EngineBase
{
    private readonly IOrganizationAccessor _organizationAccessor;

    private readonly IApplicationAccessor _applicationAccessor;

    public FormattingEngine(
        ILogger<FormattingEngine> logger,
        IApplicationAccessor applicationAccessor,
        IOrganizationAccessor organizationAccessor
    ) : base(logger)
    {
        _applicationAccessor = applicationAccessor;
        _organizationAccessor = organizationAccessor;
    }
}