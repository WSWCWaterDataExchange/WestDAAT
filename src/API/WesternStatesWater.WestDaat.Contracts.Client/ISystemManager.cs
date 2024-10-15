using GeoJSON.Text.Feature;
using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface ISystemManager : IServiceContractBase
    {
        Task<List<BeneficialUseItem>> GetAvailableBeneficialUseNormalizedNames();
        Task<List<string>> GetAvailableWaterSourceTypeNormalizedNames();
        Task<List<string>> GetAvailableOwnerClassificationNormalizedNames();
        Task<List<string>> GetAvailableStateNormalizedNames();
        Task<List<string>> GetAvailableAllocationTypeNormalizedNames();

        List<string> GetRiverBasinNames();

        FeatureCollection GetRiverBasinPolygonsByName(string[] basinNames);
    }
}
