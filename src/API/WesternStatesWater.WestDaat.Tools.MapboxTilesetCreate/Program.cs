using GeoJSON.Text.Feature;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Common.Configuration;
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
                .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
                .Build();

            var hostBuilder = Host.CreateDefaultBuilder();
            var services = hostBuilder.ConfigureServices((_, services) =>
            {
                services.AddScoped(_ => config.GetDatabaseConfiguration());
                services.AddScoped(_ => config.GetNldiConfiguration());
                services.AddScoped(_ => config.GetBlobStorageConfiguration());
                services.AddScoped(_ => config.GetPerformanceConfiguration());
                services
                    .AddTransient<IDatabaseContextFactory,
                        DatabaseContextFactory>();
                services.AddScoped<IWaterAllocationManager, WaterAllocationManager>();
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.AddScoped<ISiteAccessor, SiteAccessor>();
                services.AddScoped<INldiAccessor, NldiAccessor>();
                services.AddTransient<IGeoConnexEngine, GeoConnexEngine>();
                services.AddScoped<IWaterAllocationManager, WaterAllocationManager>();
                services.AddScoped<IBlobStorageSdk, BlobStorageSdk>();
                services.AddScoped<ITemplateResourceSdk, TemplateResourceSdk>();
                services.AddTransient<IUsgsNldiSdk, UsgsNldiSdk>();
                services.AddHttpClient<IUsgsNldiSdk, UsgsNldiSdk>(a =>
                {
                    a.BaseAddress = new Uri(config.GetUsgsNldiServiceConfiguration().BaseAddress);
                });
                services.BuildServiceProvider();
            }).Build();

            var dir = Path.GetFullPath("geojson");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var tempPointsDir = Directory.CreateDirectory(Path.Combine(dir, "Allocations", "Points"));
            var tempPolygonsDir = Directory.CreateDirectory(Path.Combine(dir, "Allocations", "Polygons"));
            var tempUnknownDir = Directory.CreateDirectory(Path.Combine(dir, "Allocations", "Unknown"));

            var sw = Stopwatch.StartNew();
            Console.WriteLine("Starting...");
            try
            {
                var databaseContextFactory = services.Services.GetRequiredService<IDatabaseContextFactory>();
                await using var db = databaseContextFactory.Create();

                bool end = false;
                int page = 0;
                int take = 25000;
                long lastSiteId = 0;
                while (!end)
                {
                    ConcurrentBag<Feature> pointFeatures = [];
                    ConcurrentBag<Feature> polygonFeatures = [];
                    ConcurrentBag<Feature> unknownFeatures = [];

                    Console.WriteLine($"Fetching records {page * take} to {(page + 1) * take}");
                    var sites = await db.AllocationAmountsView
                        .AsNoTracking()
                        .OrderBy(s => s.SiteId)
                        .Where(s => s.SiteId > lastSiteId)
                        .Take(take)
                        .ToArrayAsync();

                    Parallel.ForEach(sites, site =>
                    {
                        var properties = new Dictionary<string, object>
                        {
                            { "o", PipeDelimterToString(site.Owners) },
                            { "oClass", PipeDelimiterToDistinctList(site.OwnerClassifications) },
                            { "bu", PipeDelimiterToDistinctList(site.BeneficalUses) },
                            { "uuid", site.SiteUuid },
                            { "podPou", site.PodPou },
                            { "wsType", PipeDelimiterToDistinctList(site.WaterSources) },
                            { "st", PipeDelimiterToDistinctList(site.States) },
                            { "xmpt", site.ExemptOfVolumeFlowPriority }
                        };

                        if (site.MinCfsFlow.HasValue) properties.Add("minFlow", site.MinCfsFlow.Value);
                        if (site.MaxCfsFlow.HasValue) properties.Add("maxFlow", site.MaxCfsFlow.Value);
                        if (site.MinAfVolume.HasValue) properties.Add("minVol", site.MinAfVolume.Value);
                        if (site.MaxAfVolume.HasValue) properties.Add("maxVol", site.MaxAfVolume.Value);
                        if (site.MinPriorityDate.HasValue)
                            properties.Add("minPri", GetUnixTime(site.MinPriorityDate.Value)!.Value);
                        if (site.MaxPriorityDate.HasValue)
                            properties.Add("maxPri", GetUnixTime(site.MaxPriorityDate.Value)!.Value);
                        var geometry = site.Geometry.AsGeoJsonGeometry() ?? site.Point.AsGeoJsonGeometry();

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

                    var pointsTask = WriteFeatures(pointFeatures,
                        Path.Combine(dir, "Allocations", "Points", Path.GetRandomFileName()));
                    var polygonsTask = WriteFeatures(polygonFeatures,
                        Path.Combine(dir, "Allocations", "Polygons", Path.GetRandomFileName()));
                    var unknownTask = WriteFeatures(unknownFeatures,
                        Path.Combine(dir, "Allocations", "Unknown", Path.GetRandomFileName()));

                    await pointsTask;
                    await polygonsTask;
                    await unknownTask;

                    page++;
                    end = sites.Length < take;
                    lastSiteId = sites[^1].SiteId;
                }

                Console.WriteLine("Combining temp point files...");
                string[] pointFiles = tempPointsDir.GetFiles()
                    .Where(f => !f.Name.Contains("DS_Store"))
                    .Select(f => f.FullName).ToArray();

                if (pointFiles.Length > 0)
                {
                    await CombineFiles(pointFiles, Path.Combine(dir, "Allocations.Points.geojson"));
                }

                Console.WriteLine("Combining temp polygons files...");
                string[] polygonsFiles = tempPolygonsDir.GetFiles()
                    .Where(f => !f.Name.Contains("DS_Store"))
                    .Select(f => f.FullName).ToArray();

                if (polygonsFiles.Length > 0)
                {
                    await CombineFiles(polygonsFiles, Path.Combine(dir, "Allocations.Polygons.geojson"));
                }

                Console.WriteLine("Combining temp unknown files...");
                string[] unknownFiles = tempUnknownDir.GetFiles()
                    .Where(f => !f.Name.Contains("DS_Store"))
                    .Select(f => f.FullName).ToArray();

                if (unknownFiles.Length > 0)
                {
                    await CombineFiles(unknownFiles, Path.Combine(dir, "Allocations.Unknown.geojson"));
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error: {ex.Message} {ex.StackTrace}");
                Console.ResetColor();
            }
            finally
            {
                sw.Stop();
                Console.WriteLine("Cleaning up temp files...");
                Directory.Delete(tempPointsDir.FullName, true);
                Directory.Delete(tempPolygonsDir.FullName, true);
                Directory.Delete(tempUnknownDir.FullName, true);
            }


            Console.WriteLine($"Done. Took {(int) sw.Elapsed.TotalMinutes} minutes");
        }

        private static string PipeDelimterToString(string? value)
        {
            if (value == null) return string.Empty;
            var distinctList = PipeDelimiterToDistinctList(value);
            return string.Join(" ", distinctList);
        }

        private static string[] PipeDelimiterToDistinctList(string? value)
        {
            return value == null ? [] : value.Split("||").Distinct().ToArray();
        }

        private static long? GetUnixTime(DateTime? value)
        {
            if (value == null)
            {
                return null;
            }

            return new DateTimeOffset(value.Value).ToUnixTimeSeconds();
        }

        private static async Task CombineFiles(string[] files, string destFileName)
        {
            using (var outputStream = File.Create(destFileName))
            {
                using (var utf8Writer = new Utf8JsonWriter(outputStream))
                {
                    utf8Writer.WriteStartArray();

                    foreach (var filePath in files)
                    {
                        using (var inputStream = File.OpenRead(filePath))
                        {
                            using (var jsonDoc = await JsonDocument.ParseAsync(inputStream))
                            {
                                if (jsonDoc.RootElement.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var element in jsonDoc.RootElement.EnumerateArray())
                                    {
                                        element.WriteTo(utf8Writer);
                                    }
                                }
                                else
                                {
                                    throw new InvalidDataException($"File {filePath} does not contain a JSON array.");
                                }
                            }
                        }

                        await utf8Writer.FlushAsync();
                    }

                    utf8Writer.WriteEndArray();
                }
            }
        }

        private static async Task WriteFeatures(ConcurrentBag<Feature> features, string path)
        {
            if (features.Any())
            {
                await using var stream = new FileStream(path, FileMode.Create);
                await JsonSerializer.SerializeAsync(stream, features, features.GetType());
            }
            else if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
    }
}