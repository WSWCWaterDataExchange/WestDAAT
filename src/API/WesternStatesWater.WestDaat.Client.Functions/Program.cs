using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Client.Functions;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Database.EntityFramework;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Utilities;

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

        services.AddScoped(a => configuration.GetDatabaseConfiguration());
        services.AddScoped(a => configuration.GetNldiConfiguration());
        services.AddScoped(a => configuration.GetSmtpConfiguration());
        services.AddScoped(a => configuration.GetBlobStorageConfiguration());
        services.AddScoped(a => configuration.GetPerformanceConfiguration());

        services.AddScoped<IApplicationManager, ConservationManager>();
        services.AddScoped<INotificationManager, NotificationManager>();
        services.AddScoped<IUserManager, AdminManager>();
        services.AddTransient<ISystemManager, SystemManager>();
        services.AddTransient<ITestManager, TestManager>();
        services.AddTransient<IWaterResourceManager, WaterResourceManager>();

        services.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
        services.AddTransient<ILocationEngine, LocationEngine>();
        services.AddTransient<ITestEngine, TestEngine>();

        services.AddTransient<INldiAccessor, NldiAccessor>();
        services.AddTransient<ISiteAccessor, SiteAccessor>();
        services.AddTransient<ISystemAccessor, SystemAccessor>();
        services.AddTransient<ITestAccessor, TestAccessor>();
        services.AddTransient<IWaterAllocationAccessor, WaterAllocationAccessor>();

        services.AddTransient<IDatabaseContextFactory, DatabaseContextFactory>();
        
        services.AddTransient<IEmailNotificationSdk, EmailNotificationSdk>();
        services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();
        services.AddTransient<IBlobStorageSdk, BlobStorageSdk>();
        services.AddTransient<ITemplateResourceSdk, TemplateResourceSdk>();

        services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
        {
            a.BaseAddress = new Uri(configuration.GetUsgsNldiServiceConfiguration().BaseAddress);
        });

        services.AddLogging(logging =>
        {
            logging.AddConsole();
        });
        
        services.AddScoped<IContextUtility, ContextUtility>();
    })
    .Build();

host.Run();