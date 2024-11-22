using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.Json;
using GeoJSON.Text.Feature;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WestDaat.Accessors.EntityFramework;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

public static class MapboxTileset
{
    public static async Task CreateTilesetFiles(DatabaseContext db)
    {
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
                        { "o", PipeDelimiterToString(site.Owners) },
                        { "oClass", PipeDelimiterToDistinctList(site.OwnerClassifications) },
                        { "bu", PipeDelimiterToDistinctList(site.BeneficalUses) },
                        { "uuid", site.SiteUuid },
                        { "podPou", site.PodPou },
                        { "wsType", PipeDelimiterToDistinctList(site.WaterSources) },
                        { "st", PipeDelimiterToDistinctList(site.States) },
                        { "xmpt", site.ExemptOfVolumeFlowPriority },
                        { "ls", PipeDelimiterToDistinctList(site.LegalStatus) },
                        { "sType", PipeDelimiterToDistinctList(site.SiteType) },
                        { "allocType", PipeDelimiterToDistinctList(site.AllocationType) }
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

            Console.WriteLine("Combining temp polygon files...");
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
            Console.WriteLine("Removing temp folers...");
            Directory.Delete(Path.Combine(dir, "Allocations"), true);
            Console.WriteLine($"Done. Took {(int) sw.Elapsed.TotalMinutes} minutes");
        }

        return;
    }

    private static string PipeDelimiterToString(string? value)
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