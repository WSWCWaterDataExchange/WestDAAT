using WesternStatesWater.WestDaat.Common;
using WesternStatesWater.WestDaat.Common.DataContracts;

namespace WesternStatesWater.WestDaat.Accessors
{
    public interface ISystemAccessor : IServiceContractBase
    {
        Task<List<BeneficialUseItem>> GetAvailableBeneficialUseNormalizedNames();
        Task<List<string>> GetAvailableWaterSourceTypeNormalizedNames();
        Task<List<string>> GetAvailableOwnerClassificationNormalizedNames();
        Task<List<string>> GetAvailableStateNormalizedNames();
        Task<List<string>> GetAvailableAllocationTypeNormalizedNames();
        Task<List<string>> GetAvailableLegalStatusNormalizedNames();
    }
}