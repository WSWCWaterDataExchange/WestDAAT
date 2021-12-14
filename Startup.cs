using MapboxPrototypeAPI.Accessors;
using MapboxPrototypeAPI.Accessors.EF.DatabaseModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;

[assembly: WebJobsStartup(typeof(MapboxPrototypeAPI.Startup))]
namespace MapboxPrototypeAPI
{
    public class Startup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                NullValueHandling = NullValueHandling.Ignore
            };

            builder.Services.AddTransient<IWaterAllocationAccessor, WaterAllocationAccessor>();
            builder.Services.AddTransient<IWaterAggregationAccessor, WaterAggregationAccessor>();

            builder.Services.AddDbContext<WaDE_QA_ServerContext>(options => options.UseSqlServer(
                "Server=wade-qa-server.database.windows.net;Database=WaDE_QA_Server;User ID=wade-admin;password=Orange2019!;MultipleActiveResultSets=False;TrustServerCertificate=False;Encrypt=True;Connection Timeout=30;",
                sqlServerOptions => sqlServerOptions.CommandTimeout(3000)));

            builder.Services.AddLogging();
        }
    }
}
