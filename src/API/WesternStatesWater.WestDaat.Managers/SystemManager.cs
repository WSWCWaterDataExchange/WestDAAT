using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;
using WesternStatesWater.WestDaat.Managers.Handlers;
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
            IManagerRequestHandlerResolver resolver,
            IValidationEngine validationEngine,
            ILogger<SystemManager> logger
        ) : base(resolver, validationEngine, logger)
        {
            _locationEngine = locationEngine;
            _systemAccessor = systemAccessor;
        }

        async Task<DashboardFilters> ISystemManager.LoadFilters()
        {
            return (await _systemAccessor.LoadFilters()).Map<DashboardFilters>();
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