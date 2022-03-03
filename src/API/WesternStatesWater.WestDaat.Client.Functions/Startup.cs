using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Utilities;

[assembly: FunctionsStartup(typeof(WesternStatesWater.WestDaat.Client.Functions.Startup))]

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Startup : FunctionsStartup
    {
        private readonly Dictionary<string, string> AzureFunctionConfiguration = new Dictionary<string, string>
        {
            {"Value:FUNCTIONS_WORKER_RUNTIME", "dotnet" }
        };

        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
        {
            builder.ConfigurationBuilder.SetBasePath(Environment.CurrentDirectory)
                                        .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                                        .AddInMemoryCollection(AzureFunctionConfiguration)
                                        .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                                        .AddEnvironmentVariables();
        }

        public override void Configure(IFunctionsHostBuilder builder)
        {
            var configuration = builder.GetContext().Configuration;

            builder.Services.AddSingleton(configuration.GetDatabaseConfiguration());
            builder.Services.AddSingleton(configuration.GetNldiConfiguration());

            builder.Services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
            {
                a.BaseAddress = new Uri(configuration.GetUsgsNldiServiceConfiguration().BaseAddress);
            });

            builder.Services.AddTransient<ITestManager, TestManager>();

            builder.Services.AddTransient<ITestEngine, TestEngine>();

            builder.Services.AddTransient<INldiAccessor, NldiAccessor>();
            builder.Services.AddTransient<ITestAccessor, TestAccessor>();

            builder.Services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();
            builder.Services.AddTransient<Accessors.EntityFramework.IDatabaseContextFactory, Accessors.EntityFramework.DatabaseContextFactory>();

            builder.Services.AddLogging(logging =>
            {
                logging.AddApplicationInsights();
                logging.AddConsole();
            });
        }
    }
}
