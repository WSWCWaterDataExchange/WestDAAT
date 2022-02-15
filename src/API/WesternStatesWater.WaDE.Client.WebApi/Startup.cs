using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Common;
using WesternStatesWater.WaDE.Engines;
using WesternStatesWater.WaDE.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace WesternStatesWater.WaDE.Client.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        const string AllowWebAppOnlyCORS = "AllowWebAppOnlyCORs";

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<ITestManager, TestManager>();
            services.AddScoped<ITodoManager, TodoManager>();
            services.AddScoped<ITestEngine, TestEngine>();
            services.AddScoped<ITestAccessor, TestAccessor>();
            services.AddScoped<ITodoAccessor, TodoAccessor>();

            services.AddCors(options =>
            {
                options.AddPolicy(
                    AllowWebAppOnlyCORS,
                    builder =>
                    {
                        builder.WithOrigins(Config.CorsOrigin)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    }
                );
            });

            // This uses ApplicationInsights:ConnectionString value from config/env
            services.AddApplicationInsightsTelemetry();

            services.AddLogging(logging =>
            {
                // This uses ApplicationInsights:ConnectionString value config/env
                logging.AddApplicationInsights();
                logging.AddConsole();
            });
      
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(AllowWebAppOnlyCORS);

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
