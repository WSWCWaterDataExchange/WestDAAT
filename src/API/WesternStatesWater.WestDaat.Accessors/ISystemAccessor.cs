using WesternStatesWater.WestDaat.Common;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISystemAccessor : IServiceContractBase
    {
        Task<List<string>> GetAvailableBeneficialUseNormalizedNames();
        Task<List<string>> GetAvailableWaterSourceTypeNormalizedNames();
        Task<List<string>> GetAvailableOwnerClassificationNormalizedNames();
    }
}