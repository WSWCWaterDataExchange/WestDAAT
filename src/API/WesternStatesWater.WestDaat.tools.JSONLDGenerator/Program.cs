using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
using WesternStatesWater.WestDaat.Common.DataContracts;
using WesternStatesWater.WestDaat.Utilities;

namespace WesternStatesWater.WestDaat.Tools.JSONLDGenerator
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("personal.settings.json", optional: true, reloadOnChange: true)
                .Build();

            var hostBuilder = Host.CreateDefaultBuilder();
            var services = hostBuilder.ConfigureServices((_, services) =>
            {
                services.AddScoped(_ => config.GetDatabaseConfiguration());
                services.AddScoped(_ => config.GetBlobStorageConfiguration());
                services.AddScoped(_ => config.GetPerformanceConfiguration());
                services.AddTransient<Accessors.EntityFramework.IDatabaseContextFactory, Accessors.EntityFramework.DatabaseContextFactory>();
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.AddScoped<IBlobStorageSdk, BlobStorageSdk>();
                services.AddScoped<ITemplateResourceSdk, TemplateResourceSdk>();
                services.BuildServiceProvider();
            }).Build();

            var waterAllocationAccessor = services.Services.GetService<IWaterAllocationAccessor>();

            var rawData = new List<GeoConnex>();

            if (waterAllocationAccessor != null)
            {
                rawData = await waterAllocationAccessor.GetJSONLDData();
            }
            else
            {
                Console.WriteLine("WaterAllocationAccessor service was null");
                return;
            }

            var templateResourceSdk = services.Services.GetService<ITemplateResourceSdk>();

            string stringFile;
            if (templateResourceSdk != null)
            {
                stringFile = templateResourceSdk.GetTemplate(Common.ResourceType.JsonLD);
            }
            else
            {
                Console.WriteLine("TemplateSdk was null");
                return;
            }

            var list = new List<string>();
            rawData.AsParallel().ForAll(geoConnex =>
            {
                var file = BuildGeoConnexJson(stringFile, geoConnex);
                if (!string.IsNullOrEmpty(file))
                {
                    list.Add(file);
                }
            });

            var json = JsonConvert.SerializeObject(list.ToArray(), new JsonSerializerSettings { StringEscapeHandling = StringEscapeHandling.EscapeNonAscii });
            json = System.Text.RegularExpressions.Regex.Unescape(json)
                .Replace("\",\"", ",") // from object to object
                .Replace("[\"{", "[{") // begining of the object
                .Replace("\"]", "]") // end of array
                .Replace("]\"}", "]}"); // end of object
            ;

            var stream = new MemoryStream(
                Encoding.UTF8.GetBytes(json));

            var blobStorageSdk = services.Services.GetService<IBlobStorageSdk>();

            if (blobStorageSdk != null)
            {
                await blobStorageSdk.UploadAsync("$web", "jsonld.json", stream, true);
            }
            else
            {
                Console.WriteLine("Blob storage service was null");
                return;
            }

        }

        private static string BuildGeoConnexJson(string stringFile, GeoConnex geoConnex)
        {
            if (geoConnex != null)
            {
                var geoConnexJson = string.Format(stringFile, 
                    JsonEncode(
                        geoConnex.Longitude ?? default,                  // {0}
                        geoConnex.Latitude ?? default,                   // {1}
                        geoConnex.SiteTypeCv,                            // {2}
                        geoConnex.SiteUuid,                              // {3}
                        geoConnex.GniscodeCv,                            // {4}
                        geoConnex.SiteName,                              // {5}
                        geoConnex.OrganizationDataMappingUrl,            // {6}
                        geoConnex.Geometry?.ToString() ?? string.Empty   // {7}
                    ));

                return geoConnexJson;
            }

            return string.Empty;
        }

        private static string[] JsonEncode(params object[] args)
        {
            return args.Select(arg =>
                JsonEncodedText.Encode(arg?.ToString() ?? string.Empty).ToString()
            ).ToArray();
        }
    }
}
