using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Mapping;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class SystemManager : ManagerBase, ISystemManager
    {
        private readonly ILocationEngine _locationEngine;

        private readonly ISystemAccessor _systemAccessor;

        public SystemManager(
            ILocationEngine locationEngine,
            ISystemAccessor systemAccessor,
            ILogger<SystemManager> logger) : base(logger)
        {
            _locationEngine = locationEngine;
            _systemAccessor = systemAccessor;
        }
        
        async Task<DashboardFilters> ISystemManager.LoadFilters()
        {
            var filters = await _systemAccessor.LoadFilters();
            return filters.Map<DashboardFilters>();
        }

        public List<string> GetRiverBasinNames()
        {
            return _locationEngine.GetRiverBasinNames();
        }

        public FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames)
        {
            return _locationEngine.GetRiverBasinPolygonsByName(basinNames);
        }
    }
}
