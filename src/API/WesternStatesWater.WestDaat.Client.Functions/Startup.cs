using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Managers;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.WestDaat.Engines;

[assembly: FunctionsStartup(typeof(WesternStatesWater.WestDaat.Client.Functions.Startup))]

namespace WesternStatesWater.WestDaat.Client.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddScoped<ITestManager, TestManager>();
            builder.Services.AddScoped<ITestEngine, TestEngine>();
            builder.Services.AddScoped<ITestAccessor, TestAccessor>();
        }
    }
}
