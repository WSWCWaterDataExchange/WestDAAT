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

        async Task<List<BeneficialUseItem>> ISystemManager.GetAvailableBeneficialUseNormalizedNames()
        {
            return (await _systemAccessor.GetAvailableBeneficialUseNormalizedNames()).Map<List<BeneficialUseItem>>();
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

        async Task<List<string>> ISystemManager.GetAvailableAllocationTypeNormalizedNames()
        {
            return await _systemAccessor.GetAvailableAllocationTypeNormalizedNames();
        }

        async Task<List<string>> ISystemManager.GetAvailableLegalStatusNormalizedNames()
        {
            return await _systemAccessor.GetAvailableLegalStatusNormalizedNames();
        }

        async Task<List<string>> ISystemManager.GetAvailableSiteTypeNormalizedNames()
        {
            return await _systemAccessor.GetAvailableSiteTypeNormalizedNames();
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
