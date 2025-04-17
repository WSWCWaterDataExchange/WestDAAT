using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;

namespace WesternStatesWater.WestDaat.Engines;

public sealed partial class FormattingEngine : EngineBase
{
    private readonly EnvironmentConfiguration _environmentConfiguration;
    
    private readonly EmailServiceConfiguration _emailServiceConfiguration;

    private readonly IOrganizationAccessor _organizationAccessor;

    private readonly IApplicationAccessor _applicationAccessor;

    private readonly IUserAccessor _userAccessor;

    public FormattingEngine(
        ILogger<FormattingEngine> logger,
        EnvironmentConfiguration environmentConfiguration,
        EmailServiceConfiguration emailServiceConfiguration,
        IApplicationAccessor applicationAccessor,
        IOrganizationAccessor organizationAccessor,
        IUserAccessor userAccessor
    ) : base(logger)
    {
        _environmentConfiguration = environmentConfiguration;
        _emailServiceConfiguration = emailServiceConfiguration;
        _applicationAccessor = applicationAccessor;
        _organizationAccessor = organizationAccessor;
        _userAccessor = userAccessor;
    }
}