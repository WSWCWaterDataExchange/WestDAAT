using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using WesternStatesWater.Shared.Extensions;

namespace WesternStatesWater.WestDaat.Managers.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterRequestHandlers(this IServiceCollection services)
    {
        Assembly.GetExecutingAssembly().RegisterRequestHandlers(services);

        return services;
    }
}