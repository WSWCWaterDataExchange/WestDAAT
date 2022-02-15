using WesternStatesWater.WaDE.Accessors;
using WesternStatesWater.WaDE.Managers;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(WesternStatesWater.WaDE.Client.Functions.Startup))]

namespace WesternStatesWater.WaDE.Client.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddScoped<ITodoManager, TodoManager>();
            builder.Services.AddScoped<ITodoAccessor, TodoAccessor>();
        }
    }
}
