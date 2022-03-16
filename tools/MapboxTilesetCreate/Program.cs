
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
                            // http://wiki.gis.com/wiki/index.php/Decimal_degrees
                            site.Longitude.HasValue ? Math.Round(site.Longitude.Value, 6) : 0,
                            site.Latitude.HasValue ? Math.Round(site.Latitude.Value, 6) : 0
                        }
                    },
                    Properties = new Dictionary<string, object>
                    {
                        {"allocationFlowCfs", siteAllocations.Select(a => a.AllocationFlowCfs).Distinct().ToList()},
                        {"allocationVolumeAf", siteAllocations.Select(a => a.AllocationVolumeAf).Distinct().ToList() },
                        {"allocationOwners", siteAllocations.Select(a => a.AllocationOwner).Distinct().ToList()},
                        {"ownerClassifications", siteAllocations.Select(a => a.OwnerClassification).Distinct().ToList()},
                        {"beneficialUses", siteAllocations.SelectMany(a => a.BeneficialUses).Distinct().ToList()},
                        {"allocationPriorityDate", siteAllocations.Select(a => new DateTimeOffset(a.AllocationPriorityDate).ToUnixTimeSeconds()).Distinct().ToList()},
                        {"siteUuid", site.SiteUuid},
                        {"siteName", site.SiteName},
                        {"waterSourceTypes", site.WaterSourceTypes},
                    }
                };

                features.Add(feature);
            });

            Console.WriteLine("Writing to geojson files...");
            var dir = "geojson";

            var path = Path.Combine(dir, $"Allocations.geojson");
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await JsonSerializer.SerializeAsync(stream, features, features.GetType());
            }


            Console.WriteLine($"Done. Took {(int)sw.Elapsed.TotalMinutes} minutes");
        }

        private static async Task<int> SaveInChunks(List<GeoJsonFeature> randomFeatures, string dir)
        {
            // Split into seperate sources as workaround 500kb tile limit
            // Otherwise features will be dropped from the tileset
            var numberOfSources = 10;
            var chunkSize = (int)Math.Ceiling(randomFeatures.Count / (double)numberOfSources);
            Directory.CreateDirectory(dir);
            var fileNumber = 0;

            foreach (var chunk in randomFeatures.Chunk(chunkSize))
            {
                var path = Path.Combine(dir, $"Allocations_{++fileNumber}.geojson");
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await JsonSerializer.SerializeAsync(stream, chunk, chunk.GetType());
                }
            }

            return fileNumber;
        }
    }
}
