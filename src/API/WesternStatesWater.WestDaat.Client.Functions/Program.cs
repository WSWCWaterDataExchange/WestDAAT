using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Reflection;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Client.Functions;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Utilities;
using MGR = WesternStatesWater.WestDaat.Managers;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(builder =>
    {
        builder.UseMiddleware<HttpContextAccessorMiddleware>();
    })
    .ConfigureAppConfiguration((_, configBuilder) =>
    {
        var azureFunctionConfiguration = new Dictionary<string, string>
        {
            { "Value:FUNCTIONS_WORKER_RUNTIME", "dotnet-isolated" }
        };

        configBuilder
            .SetBasePath(Environment.CurrentDirectory)
            .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
            .AddInMemoryCollection(azureFunctionConfiguration)
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
            .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
            .AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        var configuration = context.Configuration;

        services.AddHttpContextAccessor();
        services.AddOpenApi();

        // Config
        services.AddScoped(_ => configuration.GetBlobStorageConfiguration());
        services.AddScoped(_ => configuration.GetDatabaseConfiguration());
        services.AddScoped(_ => configuration.GetEnvironmentConfiguration());
        services.AddScoped(_ => configuration.GetIdentityProviderConfiguration());
        services.AddScoped(_ => configuration.GetMessageBusConfiguration());
        services.AddScoped(_ => configuration.GetNldiConfiguration());
        services.AddScoped(_ => configuration.GetOpenEtConfiguration());
        services.AddScoped(_ => configuration.GetPerformanceConfiguration());
        services.AddScoped(_ => configuration.GetSmtpConfiguration());

        // Managers
        services.AddTransient<IApplicationManager, ConservationManager>();
        services.AddTransient<INotificationManager, NotificationManager>();
        services.AddTransient<IOrganizationManager, AdminManager>();
        services.AddTransient<ITestManager, TestManager>();
        services.AddTransient<IUserManager, AdminManager>();
        services.AddTransient<IWaterResourceManager, WaterResourceManager>();

        // Manager handlers
        services.AddScoped<
            MGR.Handlers.IManagerRequestHandlerResolver,
            MGR.Handlers.RequestHandlerResolver
        >();

        MGR.Extensions.ServiceCollectionExtensions.RegisterRequestHandlers(services);

        // Engines
        services.AddTransient<IApplicationFormattingEngine, FormattingEngine>();
        services.AddTransient<ICalculationEngine, CalculationEngine>();
        services.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
        services.AddTransient<ILocationEngine, LocationEngine>();
        services.AddTransient<ITestEngine, TestEngine>();
        services.AddTransient<IUserNameFormattingEngine, FormattingEngine>();
        services.AddTransient<IValidationEngine, ValidationEngine>();

        // Accessors
        services.AddTransient<IApplicationAccessor, ApplicationAccessor>();
        services.AddTransient<INldiAccessor, NldiAccessor>();
        services.AddTransient<IOrganizationAccessor, OrganizationAccessor>();
        services.AddTransient<ISiteAccessor, SiteAccessor>();
        services.AddTransient<ISystemAccessor, SystemAccessor>();
        services.AddTransient<ITestAccessor, TestAccessor>();
        services.AddTransient<IUserAccessor, UserAccessor>();
        services.AddTransient<IWaterAllocationAccessor, WaterAllocationAccessor>();

        // Database
        services.AddTransient<IDatabaseContextFactory, DatabaseContextFactory>();
        services.AddTransient<IWestDaatDatabaseContextFactory, WestDaatDatabaseContextFactory>();

        // Utilities / Sdks
        services.AddScoped<IContextUtility, ContextUtility>();
        services.AddTransient<IBlobStorageSdk, BlobStorageSdk>();
        services.AddTransient<IEmailNotificationSdk, EmailNotificationSdk>();
        services.AddTransient<IMessageBusUtility, MessageBusUtility>();
        services.AddTransient<IOpenEtSdk, OpenEtSdk>();
        services.AddTransient<ISecurityUtility, SecurityUtility>();
        services.AddTransient<ITemplateResourceSdk, TemplateResourceSdk>();
        services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();

        services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
        {
            a.BaseAddress = new Uri(configuration.GetUsgsNldiServiceConfiguration().BaseAddress);
        });

        services.AddHttpClient<IOpenEtSdk, OpenEtSdk>(a =>
        {
            a.BaseAddress = new Uri(configuration.GetOpenEtConfiguration().BaseAddress);
        });

        services.AddLogging(logging =>
        {
            logging.AddConsole();
        });
    })
    .Build();

host.Run();