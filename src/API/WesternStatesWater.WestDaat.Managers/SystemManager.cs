using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class SystemManager : ManagerBase, ISystemManager
    {
        private readonly ISystemAccessor _systemAccessor;

        public SystemManager(
            ISystemAccessor systemAccessor,
            ILogger<SystemManager> logger) : base(logger)
        {
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
    }
}
