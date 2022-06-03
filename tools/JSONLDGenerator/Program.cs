using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Tools.JSONLDGenerator.Resources;

namespace WesternStatesWater.WestDaat.Tools.JSONLDGenerator
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddInMemoryCollection(ConfigurationHelper.DefaultConfiguration)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .Build();

            var hostBuilder = Host.CreateDefaultBuilder();
            var services = hostBuilder.ConfigureServices((_, services) =>
            {
                services.AddScoped(_ => config.GetDatabaseConfiguration());
                services.AddTransient<Accessors.EntityFramework.IDatabaseContextFactory, Accessors.EntityFramework.DatabaseContextFactory>();
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.BuildServiceProvider();
            }).Build();

            var waterAllocationAccessor = services.Services.GetService<IWaterAllocationAccessor>();

            var allocations = await waterAllocationAccessor!.GetAllWaterSiteLocations();

            var list = new List<string>();
            string stringFile = JSONLDSchemas.GeoConnexJsonTemplate;

            allocations.AsParallel().ForAll(allocation => 
            {
                list.Add(BuildGeoConnexJson(stringFile, allocation));
            });

            // trigger the push to docker
        }

        private static string BuildGeoConnexJson(string stringFile, dynamic customObject)
        {
            var geoConnexJson = string.Format(stringFile, 
                JsonEncode(
                    customObject.Longitude,                  // {0}
                    customObject.Latitude,                   // {1}
                    customObject.HUC8,                       // {2}
                    customObject.HUC12,                      // {3}
                    customObject.County,                     // {4}
                    customObject.SiteTypeCv,                 // {5}
                    customObject.SiteUuid,                   // {6}
                    customObject.GniscodeCv,                 // {7}
                    customObject.SiteName,                   // {8}
                    customObject.OrganizationDataMappingUrl, // {9}
                    customObject.Geometry?.ToString()        // {10}
                ));

            return geoConnexJson;
        }

        private static string[] JsonEncode(params object[] args)
        {
            return args.Select(arg =>
                JsonEncodedText.Encode(arg?.ToString() ?? string.Empty).ToString()
            ).ToArray();
        }
    }
}
