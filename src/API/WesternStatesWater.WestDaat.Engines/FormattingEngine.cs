using WesternStatesWater.WestDaat.Accessors;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : EngineBase
{
    private readonly IOrganizationAccessor _organizationAccessor;

    public FormattingEngine(
        ILogger<FormattingEngine> logger,
        IOrganizationAccessor organizationAccessor
    ) : base(logger)
    {
        _organizationAccessor = organizationAccessor;
    }
}