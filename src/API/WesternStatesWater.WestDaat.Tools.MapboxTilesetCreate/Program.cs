using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate
{
    public static class Program
    {
        static async Task Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .Build();

            var hostBuilder = Host.CreateDefaultBuilder();
            var services = hostBuilder.ConfigureServices((_, services) =>
            {
                services.AddScoped(_ => config.GetDatabaseConfiguration());
                services.AddScoped(_ => config.GetNldiConfiguration());
                services.AddScoped(_ => config.GetBlobStorageConfiguration());
                services.AddScoped(_ => config.GetPerformanceConfiguration());
                services.AddTransient<IDatabaseContextFactory, DatabaseContextFactory>();
                services.AddScoped<IWaterResourceManager, WaterResourceManager>();
                
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.AddScoped<ISiteAccessor, SiteAccessor>();
                services.AddScoped<INldiAccessor, NldiAccessor>();
                services.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
                services.AddScoped<IWaterResourceManager, WaterResourceManager>();
                services.AddScoped<IBlobStorageSdk, BlobStorageSdk>();
                services.AddScoped<ITemplateResourceSdk, TemplateResourceSdk>();
                services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();
                services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
                {
                    a.BaseAddress = new Uri(config.GetUsgsNldiServiceConfiguration().BaseAddress);
                });
                services.BuildServiceProvider();
            }).Build();

            var dbFactory = services.Services.GetRequiredService<IDatabaseContextFactory>();
            var db = dbFactory.Create();
            await MapboxTileset.CreateTilesetFiles(db);
        }
    }
}