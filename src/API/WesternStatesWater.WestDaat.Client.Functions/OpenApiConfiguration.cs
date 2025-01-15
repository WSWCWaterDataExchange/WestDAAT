using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace WesternStatesWater.WestDaat.Client.Functions;

public static class OpenApiConfiguration
{
    public static void AddOpenApi(this IServiceCollection services)
    {
        services.AddSingleton<IOpenApiConfigurationOptions>(_ =>
        {
            var options = new OpenApiConfigurationOptions()
            {
                Info = new OpenApiInfo()
                {
                    Version = "1.0.0",
                    Title = "Function App API",
                    Description = "API for WestDAAT Application",
                },
                OpenApiVersion = OpenApiVersionType.V2,
                ForceHttps = true,
                ForceHttp = false,
            };

            return options;
        });
    }
}