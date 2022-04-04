using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;
using WesternStatesWater.WestDaat.Engines;

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

        async Task<List<string>> ISystemManager.GetAvailableBeneficialUseNormalizedNames()
        {
            return await _systemAccessor.GetAvailableBeneficialUseNormalizedNames();
        }

        async Task<List<string>> ISystemManager.GetAvailableOwnerClassificationNormalizedNames()
        {
            return await _systemAccessor.GetAvailableOwnerClassificationNormalizedNames();
        }

        async Task<List<string>> ISystemManager.GetAvailableWaterSourceTypeNormalizedNames()
        {
            return await _systemAccessor.GetAvailableWaterSourceTypeNormalizedNames();
        }

        async Task<List<string>> ISystemManager.GetAvailableStateNormalizedNames()
        {
            return await _systemAccessor.GetAvailableStateNormalizedNames();
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
