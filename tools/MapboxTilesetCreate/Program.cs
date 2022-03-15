
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers;
using WesternStatesWater.WestDaat.Utilities;
using System.Threading.Tasks;
using System.Text.Json;
using System.Diagnostics;
using WesternStatesWater.WestDaat.Common.DataContracts;
using System.Collections.Concurrent;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate
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
                services.AddScoped(_ => config.GetNldiConfiguration());
                services.AddTransient<Accessors.EntityFramework.IDatabaseContextFactory, Accessors.EntityFramework.DatabaseContextFactory>();
                services.AddScoped<IWaterAllocationManager, WaterAllocationManager>();
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.AddScoped<ISiteAccessor, SiteAccessor>();
                services.AddScoped<INldiAccessor, NldiAccessor>();
                services.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
                services.AddScoped<IWaterAllocationManager, WaterAllocationManager>();
                services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();
                services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
                {
                    a.BaseAddress = new Uri(config.GetUsgsNldiServiceConfiguration().BaseAddress);
                });
                services.BuildServiceProvider();
            }).Build();

            var sw = Stopwatch.StartNew();

            var waterAllocationManager = services.Services.GetService<IWaterAllocationAccessor>();
            var waterAllocationAccessor = services.Services.GetService<IWaterAllocationAccessor>();
            var siteAccessor = services.Services.GetService<ISiteAccessor>();

            Console.WriteLine("Fetching sites and allocations...");

            Console.WriteLine("Fetching allocations...");
            var allocations = await waterAllocationAccessor!.GetAllWaterAllocations();

            Console.WriteLine("Fetching sites...");
            var sitesTask = siteAccessor!.GetSites();

            Console.WriteLine("Building site allocations...");
            var allSiteAllocations = new ConcurrentDictionary<long, List<AllocationAmount>>();
            Parallel.ForEach(allocations, allocation =>
            {
                foreach (var siteId in allocation.SiteIds)
                {
                    allSiteAllocations.GetOrAdd(siteId, new List<AllocationAmount>())
                        .Add(allocation);
                }
            });
            Console.WriteLine("Built site allocations.");

            var sites = await sitesTask;
            Console.WriteLine("Fetched sites.");

            Console.WriteLine("Mapping to GeoJsonFeature...");
            var features = new ConcurrentBag<GeoJsonFeature>();
            Parallel.ForEach(sites, site =>
            {
                var hasAllocations = allSiteAllocations.TryGetValue(site.SiteId, out var siteAllocations);
                if (!hasAllocations)
                {
                    return;
                }

                var feature = new GeoJsonFeature
                {
                    Geometry = new GeoJsonGeometry
                    {
                        Type = "Point",
                        Coordinates = new double[]
                        {
                            site.Longitude ?? 0,
                            site.Latitude ?? 0
                        }
                    },
                    Properties = new Dictionary<string, object>
                    {
                        {"allocationIds", siteAllocations.Select(a => a.AllocationAmountId).ToList()},
                        {"allocationFlowCfs", siteAllocations.Select(a => a.AllocationFlowCfs).ToList()},
                        {"allocationVolumeAf", siteAllocations.Select(a => a.AllocationVolumeAf).ToList() },
                        {"allocationOwners", siteAllocations.Select(a => a.AllocationOwner).ToList()},
                        {"ownerClassifications", siteAllocations.Select(a => a.OwnerClassification).ToList()},
                        {"beneficialUses", siteAllocations.SelectMany(a => a.BeneficialUses).ToList()},
                        {"allocationPriorityDate", siteAllocations.Select(a => new DateTimeOffset(a.AllocationPriorityDate).ToUnixTimeSeconds()).ToList()},
                        {"siteUuid", site.SiteUuid},
                        {"siteName", site.SiteName},
                        {"waterSourceTypes", site.WaterSourceTypes},
                    }
                };

                features.Add(feature);
            });
            Console.WriteLine($"Done. Took {sw.Elapsed.TotalMinutes} minutes");

            Console.WriteLine("Writing to geojson file...");
            Directory.CreateDirectory("geojson");
            var path = Path.Combine("geojson", $"Allocations.geojson");
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await JsonSerializer.SerializeAsync(stream, features, features.GetType());
            }

            Console.WriteLine($"Done. Took {sw.Elapsed.TotalMinutes} minutes");
        }
    }
}
