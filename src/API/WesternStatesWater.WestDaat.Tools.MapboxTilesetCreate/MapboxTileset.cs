using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.Json;
using GeoJSON.Text.Feature;
using Microsoft.EntityFrameworkCore;
using WesternStatesWater.WaDE.Database.EntityFramework;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tools.MapboxTilesetCreate;

public static class MapboxTileset
{
    private static readonly ConcurrentDictionary<string, byte> WaterRightBeneficialUses = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightOwnerClassifications = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightAllocationTypes = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightLegalStatuses = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightSiteTypes = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightWaterSources = new();
    private static readonly ConcurrentDictionary<string, byte> WaterRightStates = new();

    private static readonly ConcurrentDictionary<string, byte> OverlayTypes = new();
    private static readonly ConcurrentDictionary<string, byte> OverlayWaterSources = new();
    private static readonly ConcurrentDictionary<string, byte> OverlayStates = new();

    private static readonly ConcurrentDictionary<string, byte> TimeSeriesSiteTypes = new();
    private static readonly ConcurrentDictionary<string, byte> TimeSeriesPrimaryUses = new();
    private static readonly ConcurrentDictionary<string, byte> TimeSeriesVariableTypes = new();
    private static readonly ConcurrentDictionary<string, byte> TimeSeriesWaterSources = new();
    private static readonly ConcurrentDictionary<string, byte> TimeSeriesStates = new();
    public static async Task CreateTilesetFiles(DatabaseContext db)
    {
        Console.WriteLine("Starting...");

        var dir = Path.GetFullPath("geojson");
        if (!Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }

        var sw = Stopwatch.StartNew();
        try
        {
            await CreateAllocations(db, dir);
            await CreateTimeSeries(db, dir);
            await CreateOverlays(db, dir);
            
            await WriteFiltersToDatabase(db);
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
            Console.WriteLine($"Done. Took {(int) sw.Elapsed.TotalMinutes} minutes");
        }
    }

    internal static async Task CreateAllocations(DatabaseContext db, string geoJsonDirectoryPath)
    {
        var tempPointsDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "Allocations", "Points"));
        var tempPolygonsDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "Allocations", "Polygons"));
        var tempUnknownDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "Allocations", "Unknown"));
        
        try
        {
            bool end = false;
            int page = 0;
            int take = 10000;
            long lastSiteId = 0;
            while (!end)
            {
                
                ConcurrentBag<Feature> pointFeatures = [];
                ConcurrentBag<Feature> polygonFeatures = [];
                ConcurrentBag<Feature> unknownFeatures = [];

                Console.WriteLine($"Fetching allocation records {page * take} to {(page + 1) * take}");
                var sites = await db.AllocationAmountsView
                    .AsNoTracking()
                    .OrderBy(s => s.SiteId)
                    .Where(s => s.SiteId > lastSiteId)
                    .Take(take)
                    .ToArrayAsync();

                Parallel.ForEach(sites, site =>
                {
                    foreach (var bu in PipeDelimiterToDistinctList(site.BeneficalUses)) SafeTryAdd(WaterRightBeneficialUses, bu);
                    foreach (var oc in PipeDelimiterToDistinctList(site.OwnerClassifications)) SafeTryAdd(WaterRightOwnerClassifications, oc);
                    foreach (var at in PipeDelimiterToDistinctList(site.AllocationType)) SafeTryAdd(WaterRightAllocationTypes, at);
                    foreach (var ls in PipeDelimiterToDistinctList(site.LegalStatus)) SafeTryAdd(WaterRightLegalStatuses, ls);
                    foreach (var st in PipeDelimiterToDistinctList(site.SiteType)) SafeTryAdd(WaterRightSiteTypes, st);
                    foreach (var ws in PipeDelimiterToDistinctList(site.WaterSources)) SafeTryAdd(WaterRightWaterSources, ws);
                    foreach (var state in PipeDelimiterToDistinctList(site.States)) SafeTryAdd(WaterRightStates, state);
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
                    Path.Combine(geoJsonDirectoryPath, "Allocations", "Points", Path.GetRandomFileName()));
                var polygonsTask = WriteFeatures(polygonFeatures,
                    Path.Combine(geoJsonDirectoryPath, "Allocations", "Polygons", Path.GetRandomFileName()));
                var unknownTask = WriteFeatures(unknownFeatures,
                    Path.Combine(geoJsonDirectoryPath, "Allocations", "Unknown", Path.GetRandomFileName()));

                await pointsTask;
                await polygonsTask;
                await unknownTask;

                page++;
                end = sites.Length < take;
                if (sites.Length > 0)
                {
                    lastSiteId = sites[^1].SiteId;
                }
            }

            string[] pointFiles = tempPointsDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (pointFiles.Length > 0)
            {
                Console.WriteLine("Combining temp point files...");
                await CombineFiles(pointFiles, Path.Combine(geoJsonDirectoryPath, "Allocations.Points.geojson"));
            }

            string[] polygonsFiles = tempPolygonsDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (polygonsFiles.Length > 0)
            {
                Console.WriteLine("Combining temp polygon files...");
                await CombineFiles(polygonsFiles, Path.Combine(geoJsonDirectoryPath, "Allocations.Polygons.geojson"));
            }

            string[] unknownFiles = tempUnknownDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (unknownFiles.Length > 0)
            {
                Console.WriteLine("Combining temp unknown files...");
                await CombineFiles(unknownFiles, Path.Combine(geoJsonDirectoryPath, "Allocations.Unknown.geojson"));
            }
        }
        finally
        {
            Directory.Delete(Path.Combine(geoJsonDirectoryPath, "Allocations"), true);
        }
    }

    internal static async Task CreateTimeSeries(DatabaseContext db, string geoJsonDirectoryPath)
    {
        var tempPointsDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Points"));
        var tempPolygonsDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Polygons"));
        var tempUnknownDir = Directory.CreateDirectory(Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Unknown"));

        ConcurrentBag<Feature> pointFeatures = [];
        ConcurrentBag<Feature> polygonFeatures = [];
        ConcurrentBag<Feature> unknownFeatures = [];
        List<TimeSeries> featureSites = [];

        try
        {
            bool end = false; // Used to determine when to stop querying the database.
            int page = 0; // Used for logging to indicate where we are in paging the database.
            int take = 50000; // Number of records to return from the query
            
            // These are used for our keyset pagination. We order by SiteId and SiteVariableAmountId.
            long lastSiteId = 0; // Used to track the last SiteID returned from the query.
            long lastSiteVariableAmountId = 0; // Used to track the last SiteVariableAmountID returned from the query.
            
            long? previousSiteId = null; // Used to track the previous SiteID to determine when to create a GeoJSON feature.
            while (!end)
            {
                Console.WriteLine($"Fetching time series records {page * take} to {(page + 1) * take}");
                // Due to the amount of time series (SiteVariableAmountsFact) records, we order by SiteId and SiteVariableAmountId.
                // When the SiteID changes, we generate a GeoJSON feature and add it to the appropriate list.
                var timeSeries = await db.SiteVariableAmountsFact
                    .AsNoTracking()
                    .OrderBy(s => s.SiteId)
                    .ThenBy(s => s.SiteVariableAmountId)
                    .Where(s => s.SiteId > lastSiteId ||
                                (s.SiteId == lastSiteId && s.SiteVariableAmountId > lastSiteVariableAmountId))
                    .Take(take)
                    .Select(x => new TimeSeries
                    {
                        SiteId = x.SiteId,
                        SiteVariableAmountId = x.SiteVariableAmountId,
                        SiteUuid = x.Site.SiteUuid,
                        State = x.Site.StateCv,
                        PrimaryUseCagtegory = x.PrimaryBeneficialUse.WaDEName,
                        VariableType = x.VariableSpecific.VariableCvNavigation.WaDEName,
                        SiteType = x.Site.SiteTypeCvNavigation.WaDEName,
                        WaterSourceType = x.WaterSource.WaterSourceTypeCvNavigation.WaDEName,
                        Location = x.Site.Geometry ?? x.Site.SitePoint,
                        StartDate = x.TimeframeStartNavigation.Date,
                        EndDate = x.TimeframeEndNavigation.Date
                    })
                    .ToArrayAsync();

                foreach (var timeSeriesSite in timeSeries)
                {
                    SafeTryAdd(TimeSeriesPrimaryUses, timeSeriesSite.PrimaryUseCagtegory);
                    SafeTryAdd(TimeSeriesVariableTypes, timeSeriesSite.VariableType);
                    SafeTryAdd(TimeSeriesSiteTypes, timeSeriesSite.SiteType);
                    SafeTryAdd(TimeSeriesWaterSources, timeSeriesSite.WaterSourceType);
                    SafeTryAdd(TimeSeriesStates, timeSeriesSite.State);
                    // Check if the SitEID has changed from the previous record.
                    if (previousSiteId != null && timeSeriesSite.SiteId != previousSiteId)
                    {
                        // SiteID changed, create GeoJSON feature 
                        var feature = CreateSiteTimeSeriesFeature(featureSites);

                        switch (feature.Geometry.Type)
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

                        featureSites.Clear();
                    }

                    featureSites.Add(timeSeriesSite);
                    previousSiteId = timeSeriesSite.SiteId;
                }

                page++;
                end = timeSeries.Length < take;
                if (timeSeries.Length > 0)
                {
                    lastSiteId = timeSeries[^1].SiteId;
                    lastSiteVariableAmountId = timeSeries[^1].SiteVariableAmountId;
                }
            }

            // Check if there are any remaining sites in the featureSites list.
            if (featureSites.Count > 0)
            {
                var feature = CreateSiteTimeSeriesFeature(featureSites);
                switch (feature.Geometry.Type)
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

                featureSites.Clear();
            }

            var pointsTask = WriteFeatures(pointFeatures,
                Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Points", Path.GetRandomFileName()));
            var polygonsTask = WriteFeatures(polygonFeatures,
                Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Polygons", Path.GetRandomFileName()));
            var unknownTask = WriteFeatures(unknownFeatures,
                Path.Combine(geoJsonDirectoryPath, "TimeSeries", "Unknown", Path.GetRandomFileName()));

            await pointsTask;
            await polygonsTask;
            await unknownTask;

            string[] pointFiles = tempPointsDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (pointFiles.Length > 0)
            {
                Console.WriteLine("Combining temp TimeSeries point files...");
                await CombineFiles(pointFiles, Path.Combine(geoJsonDirectoryPath, "TimeSeries.Points.geojson"));
            }

            string[] polygonsFiles = tempPolygonsDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (polygonsFiles.Length > 0)
            {
                Console.WriteLine("Combining temp TimeSeries polygon files...");
                await CombineFiles(polygonsFiles, Path.Combine(geoJsonDirectoryPath, "TimeSeries.Polygons.geojson"));
            }

            string[] unknownFiles = tempUnknownDir.GetFiles()
                .Where(f => !f.Name.Contains("DS_Store"))
                .Select(f => f.FullName).ToArray();

            if (unknownFiles.Length > 0)
            {
                Console.WriteLine("Combining temp TimeSeries unknown files...");
                await CombineFiles(unknownFiles, Path.Combine(geoJsonDirectoryPath, "TimeSeries.Unknown.geojson"));
            }
        }
        finally
        {
            Directory.Delete(Path.Combine(geoJsonDirectoryPath, "TimeSeries"), true);
        }
    }


    internal static async Task CreateOverlays(DatabaseContext db, string geoJsonDirectoryPath)
    {
        ConcurrentBag<Feature> polygonFeatures = [];
        ConcurrentBag<Feature> unknownFeatures = [];

        Console.WriteLine($"Fetching overlays...");
        var overlays = await db.OverlaysViews
            .AsNoTracking()
            .ToArrayAsync();

        Parallel.ForEach(overlays, overlay =>
        {
            var properties = new Dictionary<string, object>
            {
                { "uuid", overlay.ReportingUnitUUID },
                { "oType", PipeDelimiterToDistinctList(overlay.OverlayTypeWaDEName) },
                { "state", overlay.State },
                { "wsType", PipeDelimiterToDistinctList(overlay.WaterSourceTypeWaDEName) }
            };
            
            foreach (var ot in PipeDelimiterToDistinctList(overlay.OverlayTypeWaDEName)) SafeTryAdd(OverlayTypes, ot);
            foreach (var ws in PipeDelimiterToDistinctList(overlay.WaterSourceTypeWaDEName)) SafeTryAdd(OverlayWaterSources, ws);
            SafeTryAdd(OverlayStates, overlay.State?.Trim());
            

            var geometry = overlay.Geometry.AsGeoJsonGeometry();

            var feature = new Feature(geometry, properties);

            switch (geometry.Type)
            {
                case GeoJSON.Text.GeoJSONObjectType.Polygon:
                case GeoJSON.Text.GeoJSONObjectType.MultiPolygon:
                    polygonFeatures.Add(feature);
                    break;
                default:
                    unknownFeatures.Add(feature);
                    break;
            }
        });


        if (polygonFeatures.Count > 0)
        {
            Console.WriteLine("Creating overlays polygons file...");
            await WriteFeatures(polygonFeatures, Path.Combine(geoJsonDirectoryPath, "Overlays.Polygons.geojson"));
        }


        if (unknownFeatures.Count > 0)
        {
            Console.WriteLine("Creating overlays unknown file...");
            await WriteFeatures(unknownFeatures, Path.Combine(geoJsonDirectoryPath, "Overlays.Unknown.geojson"));
        }
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
    
    private static async Task WriteFiltersToDatabase(DatabaseContext db)
    {
        Console.WriteLine("Rewriting Filters table...");

        var entries =
            WaterRightBeneficialUses.Keys.Select(v => new FilterEntry { FilterType = "WaterRightBeneficialUses", WaDeName = v })
            .Concat(WaterRightOwnerClassifications.Keys.Select(v => new FilterEntry { FilterType = "WaterRightOwnerClassifications", WaDeName = v }))
            .Concat(WaterRightAllocationTypes.Keys.Select(v => new FilterEntry { FilterType = "WaterRightAllocationTypes", WaDeName = v }))
            .Concat(WaterRightLegalStatuses.Keys.Select(v => new FilterEntry { FilterType = "WaterRightLegalStatuses", WaDeName = v }))
            .Concat(WaterRightSiteTypes.Keys.Select(v => new FilterEntry { FilterType = "WaterRightSiteTypes", WaDeName = v }))
            .Concat(WaterRightWaterSources.Keys.Select(v => new FilterEntry { FilterType = "WaterRightWaterSources", WaDeName = v }))
            .Concat(WaterRightStates.Keys.Select(v => new FilterEntry { FilterType = "WaterRightStates", WaDeName = v }))

            .Concat(OverlayTypes.Keys.Select(v => new FilterEntry { FilterType = "OverlayTypes", WaDeName = v }))
            .Concat(OverlayWaterSources.Keys.Select(v => new FilterEntry { FilterType = "OverlayWaterSources", WaDeName = v }))
            .Concat(OverlayStates.Keys.Select(v => new FilterEntry { FilterType = "OverlayStates", WaDeName = v }))

            .Concat(TimeSeriesSiteTypes.Keys.Select(v => new FilterEntry { FilterType = "TimeSeriesSiteTypes", WaDeName = v }))
            .Concat(TimeSeriesPrimaryUses.Keys.Select(v => new FilterEntry { FilterType = "TimeSeriesPrimaryUses", WaDeName = v }))
            .Concat(TimeSeriesVariableTypes.Keys.Select(v => new FilterEntry { FilterType = "TimeSeriesVariableTypes", WaDeName = v }))
            .Concat(TimeSeriesWaterSources.Keys.Select(v => new FilterEntry { FilterType = "TimeSeriesWaterSources", WaDeName = v }))
            .Concat(TimeSeriesStates.Keys.Select(v => new FilterEntry { FilterType = "TimeSeriesStates", WaDeName = v }))
            .ToArray();

        await db.Database.ExecuteSqlRawAsync("TRUNCATE TABLE dbo.Filters"); // Clear existing records
        await db.Filters.AddRangeAsync(entries); // Insert new ones
        await db.SaveChangesAsync(); // Save changes

        Console.WriteLine("Filters table updated.");
    }
    
    private static void SafeTryAdd(ConcurrentDictionary<string, byte> dict, string? key)
    {
        if (!string.IsNullOrWhiteSpace(key))
        {
            dict.TryAdd(key.Trim(), 0);
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

    private static Feature CreateSiteTimeSeriesFeature(List<TimeSeries> siteTimeSeries)
    {
        if (siteTimeSeries.Count == 0)
        {
            throw new InvalidOperationException("siteTimeSeries must not be empty.");
        }

        var first = siteTimeSeries[0];
        var properties = new Dictionary<string, object>
        {
            { "uuid", first.SiteUuid },
            { "state", first.State },
            { "siteType", first.SiteType },
            { "startDate", GetUnixTime(siteTimeSeries.Min(x => x.StartDate))! },
            { "endDate", GetUnixTime(siteTimeSeries.Max(x => x.EndDate))! },
            { "primaryUseCategory", siteTimeSeries.Select(x => x.PrimaryUseCagtegory).Distinct().ToArray() },
            { "variableType", siteTimeSeries.Select(x => x.VariableType).Distinct().ToArray() },
            { "waterSourceType", siteTimeSeries.Select(x => x.WaterSourceType).Distinct().ToArray() }
        };

        var geometry = siteTimeSeries.First().Location.AsGeoJsonGeometry();
        return new Feature(geometry, properties);
    }
}