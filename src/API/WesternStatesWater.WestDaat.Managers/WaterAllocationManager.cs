using GeoJSON.Text.Feature;
using Microsoft.Extensions.Logging;
using WesternStatesWater.WestDaat.Accessors;
using WesternStatesWater.WestDaat.Common.Contracts;
using WesternStatesWater.WestDaat.Contracts.Client;

namespace WesternStatesWater.WestDaat.Managers
{
    public sealed class WaterAllocationManager : ManagerBase, IWaterAllocationManager
    {
        public WaterAllocationManager(INldiAccessor nldiAccessor, ILogger<WaterAllocationManager> logger) : base(logger)
        {
            _nldiAccessor = nldiAccessor;
        }

        private readonly INldiAccessor _nldiAccessor;

        async Task<FeatureCollection> IWaterAllocationManager.GetNldiFeatures(double latitude, double longitude, NldiDirections directions, NldiDataPoints dataPoints)
        {
            return await _nldiAccessor.GetNldiFeatures(latitude, longitude, directions, dataPoints);
        }
    }
}
