using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class SystemManager(
        ILocationEngine locationEngine,
        ISystemAccessor systemAccessor,
        ILogger<SystemManager> logger)
        : ManagerBase(logger), ISystemManager
    {
        async Task<DashboardFilters> ISystemManager.LoadFilters()
        {
            return (await systemAccessor.LoadFilters()).Map<DashboardFilters>();
        }

        public List<string> GetRiverBasinNames()
        {
            return locationEngine.GetRiverBasinNames();
        }

        public FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames)
        {
            return locationEngine.GetRiverBasinPolygonsByName(basinNames);
        }
    }
}
