using GeoJSON.Text.Feature;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Contracts.Client;
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

            var waterAllocationAccessor = services.Services.GetService<IWaterAllocationAccessor>();
            var siteAccessor = services.Services.GetService<ISiteAccessor>();

            Console.WriteLine("Fetching allocations...");
            var allocations = await waterAllocationAccessor!.GetAllWaterAllocations();

            Console.WriteLine("Fetching sites...");
            var sitesTask = siteAccessor!.GetSites();

            Console.WriteLine("Building site allocations...");
            var allSiteAllocations = new ConcurrentDictionary<long, ConcurrentBag<AllocationAmount>>();
            Parallel.ForEach(allocations, allocation =>
            {
                if (allocation != null)
                {
                    foreach (var siteId in allocation.SiteIds)
                    {
                        allSiteAllocations.GetOrAdd(siteId, new ConcurrentBag<AllocationAmount>())
                            .Add(allocation);
                    }
                }
            });
            Console.WriteLine("Built site allocations.");

            var sites = await sitesTask;
            Console.WriteLine("Fetched sites.");

            Console.WriteLine("Mapping to GeoJsonFeature...");
            var pointFeatures = new ConcurrentBag<Feature>();
            var polygonFeatures = new ConcurrentBag<Feature>();
            var unknownFeatures = new ConcurrentBag<Feature>();
            Parallel.ForEach(sites, site =>
            {
                var hasAllocations = allSiteAllocations.TryGetValue(site.SiteId, out var siteAllocations);
                if (!hasAllocations || siteAllocations == null || siteAllocations.Count == 0)
                {
                    return;
                }

                var properties = new Dictionary<string, object>
                    {
                        {"o", string.Join(" ", siteAllocations.Select(a => a.AllocationOwner).Distinct())},
                        {"oClass", siteAllocations.Select(a => a.OwnerClassification).Distinct()},
                        {"bu", siteAllocations.SelectMany(a => a.BeneficialUses).Distinct().ToList()},
                        {"minPri", siteAllocations.Select(a => new DateTimeOffset(a.AllocationPriorityDate).ToUnixTimeSeconds()).Min() },
                        {"maxPri", siteAllocations.Select(a => new DateTimeOffset(a.AllocationPriorityDate).ToUnixTimeSeconds()).Max() },
                        {"uuid", site.SiteUuid},
                        {"podPou", site.PodPou},
                        {"wsType", site.WaterSourceTypes},
                    };

                var minFlow = siteAllocations.Select(a => a.AllocationFlowCfs).Min();
                if (minFlow != null) properties.Add("minFlow", minFlow.Value);

                var maxFlow = siteAllocations.Select(a => a.AllocationFlowCfs).Max();
                if (maxFlow != null) properties.Add("maxFlow", maxFlow.Value);

                var minVolume = siteAllocations.Select(a => a.AllocationVolumeAf).Min();
                if (minVolume != null) properties.Add("minVol", minVolume.Value);

                var maxVolume = siteAllocations.Select(a => a.AllocationVolumeAf).Max();
                if (maxVolume != null) properties.Add("maxVol", maxVolume.Value);

                var geometry = site.Geometry.AsGeoJsonGeometry();

                var feature = new Feature(geometry, properties);

                switch (geometry.Type)
                {
                    case GeoJSON.Text.GeoJSONObjectType.Point:
                    case GeoJSON.Text.GeoJSONObjectType.MultiPoint:
                        pointFeatures.Add(feature);
                        break;
                    case GeoJSON.Text.GeoJSONObjectType.Polygon:
                    case GeoJSON.Text.GeoJSONObjectType.MultiPolygon:
                        polygonFeatures.Add(feature);
                        break;
                    default:
                        unknownFeatures.Add(feature);
                        break;
                }

            });


            var dir = Path.GetFullPath("geojson");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            Console.WriteLine($"Writing to geojson files to {dir}...");

            var pointsTask = WriteFeatures(pointFeatures, Path.Combine(dir, $"Allocations.Points.geojson"));
            var polygonsTask = WriteFeatures(polygonFeatures, Path.Combine(dir, $"Allocations.Polygons.geojson"));
            var unknownTask = WriteFeatures(unknownFeatures, Path.Combine(dir, $"Allocations.Unknown.geojson"));

            await pointsTask;
            await polygonsTask;
            await unknownTask;

            Console.WriteLine($"Done. Took {(int)sw.Elapsed.TotalMinutes} minutes");
        }

        private static async Task WriteFeatures(ConcurrentBag<Feature> features, string path)
        {
            if (features.Any())
            {
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await JsonSerializer.SerializeAsync(stream, features, features.GetType());
                }
            }
            else if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
    }
}
