using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Configuration;
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
                services.AddScoped(a => config.GetBlobStorageConfiguration());
                services.AddTransient<Accessors.EntityFramework.IDatabaseContextFactory, Accessors.EntityFramework.DatabaseContextFactory>();
                services.AddScoped<IWaterAllocationAccessor, WaterAllocationAccessor>();
                services.AddScoped<IBlobStorageSdk, BlobStorageSdk>();
                services.AddScoped<ITemplateResourceSdk, TemplateResourceSdk>();
                services.BuildServiceProvider();
            }).Build();

            var waterAllocationAccessor = services.Services.GetService<IWaterAllocationAccessor>();
            var rawData = await waterAllocationAccessor!.GetJSONLDData();

            var templateResourceSdk = services.Services.GetService<ITemplateResourceSdk>();
            var stringFile = templateResourceSdk!.GetTemplate(Common.ResourceType.JsonLD);

            var list = new List<string>();
            rawData.AsParallel().ForAll(allocation => 
            {
                list.Add(BuildGeoConnexJson(stringFile, allocation));
            });

            var stream = new MemoryStream(
                Encoding.UTF8.GetBytes(
                    JsonConvert.SerializeObject(list)
                    ));

            var blobStorageSdk = services.Services.GetService<IBlobStorageSdk>();
            
            await blobStorageSdk!.UploadAsync("jsonlds", "JsonLDSchemaData", stream, true);

            Console.WriteLine("finish");
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
