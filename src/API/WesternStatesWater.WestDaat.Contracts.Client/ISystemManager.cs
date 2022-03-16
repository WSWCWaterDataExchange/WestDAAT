using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Contracts.Client
{
    public interface ISystemManager : IServiceContractBase
    {
        Task<List<string>> GetAvailableBeneficialUseNormalizedNames();
        Task<List<string>> GetAvailableWaterSourceTypeNormalizedNames();
        Task<List<string>> GetAvailableOwnerClassificationNormalizedNames();
    }
}
